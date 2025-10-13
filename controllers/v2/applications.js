const express = require("express");
const router = express.Router();
const Property = require('../../models/v2/Property.js')
const Contractor = require('../../models/v2/Contractor.js')
const Jobs = require('../../models/v2/Jobs.js')
const Application = require('../../models/v2/Application.js')

router.get("/", (req, res) => {
    Application.find().then(jobs => {
        res.json(jobs)
    })
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
                const propertyDetails = await Property.findById(jobDetails.propertyID);
                console.log("Job Details:", jobDetails);
                return {
                    job_id: jobDetails._id,
                    approved: jobDetails.approved,
                    job_number: jobDetails ? jobDetails.job_number : null,
                    job_description: jobDetails ? jobDetails.job_description : null,
                    job_type: jobDetails ? jobDetails.job_type : null,
                    job_status: jobDetails ? jobDetails.job_status : null,
                    job_status_descrp: jobDetails ? jobDetails.job_status_descrp : null,
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

// router.get("/license/:applicant_license/full", (req, res) => {
//     Application.find({ applicant_license: req.params.applicant_license }).then(jobs => {
//         res.json(jobs)

//     })
// })

//addding a new application
router.post("/add", async (req, res) => {
    const newApplication = new Application(req.body);
    try {
        const savedApplication = await newApplication.save();
        res.status(201).json(savedApplication);
    } catch (error) {
        console.error("Error adding application:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router