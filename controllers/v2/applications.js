const express = require("express");
const router = express.Router();
const Property = require('../../models/v2/Property.js')
const Contractor = require('../../models/v2/Contractor.js')
const Jobs = require('../../models/v2/Jobs.js')
const Application = require('../../models/v2/Application.js')

const applicationTitle =[
  {
    "applicant_professional_title": "RA",
    "description": "Registered Architect"
  },
  {
    "applicant_professional_title": "PE",
    "description": "Professional Engineer"
  },
  {
    "applicant_professional_title": "RLA",
    "description": "Registered Landscape Architect"
  },
  {
    "applicant_professional_title": null,
    "description": "Not provided / blank in source record"
  }
]


router.get("/", (req, res) => {
    Application.find().then(jobs => {
        res.json(jobs)
    })
})


router.get("/titles", (req, res) => {
    res.json(applicationTitle)
})

router.get("/id/:id", (req, res) => {
    Application.findById(req.params.id).then(job => {
        if (!job) {
            return res.status(404).json({ msg: "Job not found" });
        }
        res.json(job);
    }).catch(err => {
        console.error("Error fetching job by ID:", err);
        res.status(500).json({ msg: "Server error" });
    });
});

router.get("/id/:applicationID/full", async (req, res) => {
    try {
        const application = await Application.findById(req.params.applicationID);
        if (!application) {
            return res.status(404).json({ msg: "Application not found" });
        }

        const applicationInfo = { ...application.toObject() };

        // Fetch job details for each job in job_listing
        const jobapplications = await Promise.all(
            application.job_listing.map(async (job) => {
                console.log("Fetching job details for job number:", job);
                const jobDetails = await Jobs.findOne({ job_number: job });

                // If job record no longer exists, still return a placeholder entry
                if (!jobDetails) {
                    return {
                        job_id: null,
                        approved: null,
                        job_number: job,
                        job_description: null,
                        job_type: null,
                        job_status: null,
                        job_status_descrp: null,
                        property: null
                    };
                }

                const propertyDetails = jobDetails.propertyID
                    ? await Property.findById(jobDetails.propertyID)
                    : null;

                console.log("Job Details:", jobDetails);
                return {
                    job_id: jobDetails._id,
                    approved: jobDetails.approved,
                    job_number: jobDetails.job_number,
                    job_description: jobDetails.job_description,
                    job_type: jobDetails.job_type,
                    job_status: jobDetails.job_status,
                    job_status_descrp: jobDetails.job_status_descrp,
                    property: propertyDetails ? {
                        _id: propertyDetails._id,
                        house_num: propertyDetails.house_num,
                        street_name: propertyDetails.street_name,
                        borough: propertyDetails.borough,
                        zip: propertyDetails.zip
                    } : null
                };
            })
        );

        applicationInfo.job_listing = jobapplications;

        res.json(applicationInfo);
    } catch (err) {
        console.error("Error fetching application by ID:", err);
        res.status(500).json({ msg: "Server error" });
    }
});

// main router with pagination
router.get("/page/:page", (req, res) => {
    let pageNumber = !req.params.page || isNaN(req.params.page) ? 1 : parseInt(req.params.page);
    const perPage = 30
    const page = pageNumber || 1
    Application.find({})
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .then(jobs => {
            res.json(jobs)
        })
})

// find by applicant_license
router.get("/license/:applicant_license", (req, res) => {
    Application.find({ applicant_license: req.params.applicant_license }).then(jobs => {
        res.json(jobs)
    })
})

// Generic search endpoint for applicants/applications
// Usage examples:
//   GET /api/v2/applicants/search/301
//   GET /api/v2/applicants/search/Smith?page=1&limit=50
router.get("/search/:inputedData", async (req, res) => {
    const q = req.params.inputedData || req.query.q;
    const page = !req.query.page || isNaN(req.query.page) ? 1 : parseInt(req.query.page);
    const limit = !req.query.limit || isNaN(req.query.limit) ? 30 : parseInt(req.query.limit);

    if (!q || typeof q !== "string") {
        return res.status(400).json({ error: "Search term is required" });
    }

    try {
        const searchRegex = new RegExp(q, "i");

        const query = {
            $or: [
                { applicant_firstName: searchRegex },
                { applicant_lastName: searchRegex },
                { applicant_title: searchRegex },
                { applicant_license: searchRegex },
                // Match job numbers that contain the term
                { job_listing: searchRegex }
            ]
        };

        const applicants = await Application.find(query)
            .skip((page - 1) * limit)
            .limit(limit);

        // Return raw application documents (applicants)
        res.json(applicants);
    } catch (error) {
        console.error("Error searching applicants:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// router.get("/license/:applicant_license/full", (req, res) => {
//     Application.find({ applicant_license: req.params.applicant_license }).then(jobs => {
//         res.json(jobs)

//     })
// })

// adding a new application (does NOT change any Jobs fields)
router.post("/add", async (req, res) => {
    try {
        const { applicant_firstName, applicant_lastName, applicant_title, applicant_license, job_listing } = req.body;

        const newApplication = new Application({
            applicant_firstName,
            applicant_lastName,
            applicant_title,
            applicant_license,
            job_listing: Array.isArray(job_listing) ? job_listing : []
        });

        const savedApplication = await newApplication.save();

        // Intentionally do not modify Jobs here; job ↔ application
        // linkage is only managed via the /edit route.

        res.status(201).json(savedApplication);
    } catch (error) {
        console.error("Error adding application:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// edit/update an application and keep related jobs in sync
router.put("/edit/:id", async (req, res) => {
    console.log(req.body);
    try {
        const appId = req.params.id;
        const application = await Application.findById(appId);
        if (!application) {
            return res.status(404).json({ msg: "Application not found" });
        }
        const {
            applicant_firstName,
            applicant_lastName,
            applicant_title,
            applicant_license
        } = req.body;

        // Update basic fields if provided
        if (typeof applicant_firstName === "string") application.applicant_firstName = applicant_firstName;
        if (typeof applicant_lastName === "string") application.applicant_lastName = applicant_lastName;
        if (typeof applicant_title === "string") application.applicant_title = applicant_title;
        if (typeof applicant_license === "string") application.applicant_license = applicant_license;
        // If no jobs array was provided, only update applicant fields
        const jobsFromBody = req.body.jobs;
        if (typeof jobsFromBody === "undefined") {
            const updatedApplication = await application.save();
            console.log("Updated application (no job changes):", updatedApplication);
            return res.json(updatedApplication);
        }

        // Normalize incoming job IDs (ObjectId strings)
        let newJobIds;
        if (Array.isArray(jobsFromBody)) {
            newJobIds = jobsFromBody.map((id) => (id != null ? String(id) : id)).filter(Boolean);
        } else if (typeof jobsFromBody === "string") {
            newJobIds = jobsFromBody
                .split(",")
                .map((id) => id.trim())
                .filter(Boolean);
        } else {
            newJobIds = [];
        }

        // Find the Job documents for the incoming IDs
        const newJobs = newJobIds.length
            ? await Jobs.find({ _id: { $in: newJobIds } })
            : [];

        const newJobIdSet = new Set(newJobs.map((j) => j._id.toString()));
        const newJobNumbers = newJobs
            .map((j) => j.job_number)
            .filter(Boolean);

        // Find currently associated jobs by application_id
        const currentJobs = await Jobs.find({ application_id: appId });
        const currentJobIds = currentJobs.map((j) => j._id.toString());

        const removedJobIds = currentJobIds.filter((id) => !newJobIdSet.has(id));
        const addedJobIds = Array.from(newJobIdSet).filter((id) => !currentJobIds.includes(id));

        // Clear application reference from removed jobs
        if (removedJobIds.length > 0) {
            await Jobs.updateMany(
                { _id: { $in: removedJobIds } },
                { $set: { application_id: "", application_num: "" } }
            );
        }

        // Before assigning jobs to this application, remove them from any previous
        // applications' job_listing so a job is only associated with one applicant.
        if (addedJobIds.length > 0) {
            const addedJobsDocs = newJobs.filter((j) => addedJobIds.includes(j._id.toString()));
            const addedJobNumbers = addedJobsDocs
                .map((j) => j.job_number)
                .filter(Boolean);

            if (addedJobNumbers.length > 0) {
                const previousApps = await Application.find({
                    _id: { $ne: appId },
                    job_listing: { $in: addedJobNumbers }
                });

                for (const prevApp of previousApps) {
                    prevApp.job_listing = (prevApp.job_listing || []).filter(
                        (jobNum) => !addedJobNumbers.includes(jobNum)
                    );
                    await prevApp.save();
                }
            }
        }

        // Set application reference on added jobs, pointing them to the new applicant (this application)
        if (addedJobIds.length > 0) {
            await Jobs.updateMany(
                { _id: { $in: addedJobIds } },
                { $set: { application_id: appId, application_num: appId } }
            );
        }

        // Store job_numbers in the application's job_listing array
        application.job_listing = newJobNumbers;
        application.markModified("job_listing");
        const updatedApplication = await application.save();
console.log("Updated application:", updatedApplication);
        res.json(updatedApplication);
    } catch (error) {
        console.error("Error updating application:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
router.get("/newNumber", async (req, res) => {

    // generate a new applicant license number by scanning
    // existing licenses, finding the highest numeric value,
    // and incrementing it.

    try {
        const applications = await Application.find({ applicant_license: { $ne: null } }).select("applicant_license");

        let maxLicenseNum = 100000; // starting baseline

        for (const app of applications) {
            if (!app.applicant_license) continue;

            // Extract numeric portion (handles possible prefixes)
            const numericPart = app.applicant_license.toString().match(/\d+/);
            if (!numericPart) continue;

            const num = parseInt(numericPart[0], 10);
            if (!isNaN(num) && num > maxLicenseNum) {
                maxLicenseNum = num;
            }
        }

        const newLicenseNumber = maxLicenseNum + 1;
        console.log({ new_application_number: newLicenseNumber.toString() });
        res.json({ new_application_number: newLicenseNumber.toString() });
    } catch (error) {
        console.error("Error generating new applicant license number:", error);
        res.status(500).json({ error: "Internal server error" });
    }


});
module.exports = router