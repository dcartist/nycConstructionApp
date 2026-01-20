const express = require("express");
const router = express.Router();
const Property = require('../../models/v2/Property.js')
const Contractor = require('../../models/v2/Contractor.js')
const Jobs = require('../../models/v2/Jobs.js')
const Application = require('../../models/v2/Application.js')

const jobTypeCode = [
  { "job_type": "A1", "label": "Alteration Type 1" },
  { "job_type": "A2", "label": "Alteration Type 2" },
  { "job_type": "A3", "label": "Alteration Type 3" },
  { "job_type": "DM", "label": "Full Demolition" },
  { "job_type": "NB", "label": "New Building" },
  { "job_type": "PA", "label": "Place of Assembly" },
  { "job_type": "PR", "label": "LAA (ARA)" },
  { "job_type": "SC", "label": "Subdivision - Condo" },
  { "job_type": "SG", "label": "Sign" },
  { "job_type": "SI", "label": "Subdivision - Improved" },
  { "job_type": "SU", "label": "Subdivision - Unimproved" }
]
const jobsStatusMap = [
  { "job_status": "A", "job_status_short": "Pre-Filed", "job_status_descrp": "PRE-FILING" },
  { "job_status": "B", "job_status_short": "A/P Unpaid", "job_status_descrp": "APPLICATION PROCESSED-PART-NO PAYMENT" },
  { "job_status": "C", "job_status_short": "A/P to D.E.A.R", "job_status_descrp": "APPLICATION PROCESSED - PAYMENT ONLY" },
  { "job_status": "D", "job_status_short": "A/P Entire", "job_status_descrp": "APPLICATION PROCESSED - ENTIRE" },
  { "job_status": "E", "job_status_short": "AP-NPE", "job_status_descrp": "APPLICATION PROCESSED - NO PLAN EXAM" },
  { "job_status": "F", "job_status_short": "Assigned To P/E", "job_status_descrp": "APPLICATION ASSIGNED TO PLAN EXAMINER" },
  { "job_status": "G", "job_status_short": "PAA Fee Due", "job_status_descrp": "PAA FEE DUE" },
  { "job_status": "H", "job_status_short": "P/E In Process", "job_status_descrp": "PLAN EXAM - IN PROCESS" },
  { "job_status": "I", "job_status_short": "Sign-Off", "job_status_descrp": "SIGN-OFF (ARA)" },
  { "job_status": "J", "job_status_short": "P/E Disapproved", "job_status_descrp": "PLAN EXAM - DISAPPROVED" },
  { "job_status": "K", "job_status_short": "P/E Partial APRV", "job_status_descrp": "PLAN EXAM - PARTIAL APPROVAL" },
  { "job_status": "L", "job_status_short": "P/E PAA $ Pending", "job_status_descrp": "P/E PAA - PENDING FEE ESTIMATION" },
  { "job_status": "M", "job_status_short": "P/E PAA $ Resolvd", "job_status_descrp": "P/E PAA - FEE RESOLVED" },
  { "job_status": "P", "job_status_short": "Approved", "job_status_descrp": "PLAN EXAM - APPROVED" },
  { "job_status": "Q", "job_status_short": "Permit-Partial", "job_status_descrp": "PERMIT ISSUED - PARTIAL JOB" },
  { "job_status": "R", "job_status_short": "Permit-Entire", "job_status_descrp": "PERMIT ISSUED - ENTIRE JOB/WORK" },
  { "job_status": "U", "job_status_short": "Completed", "job_status_descrp": "COMPLETED" },
  { "job_status": "X", "job_status_short": "Signed-Off", "job_status_descrp": "SIGNED OFF" },
  { "job_status": "3", "job_status_short": "Suspended", "job_status_descrp": "SUSPENDED" }
]

// GET: All Jobs with Property details
router.get("/", async (req, res) => {
    try {
        const jobs = await Jobs.find();
        const jobsWithProperties = await Promise.all(
            jobs.map(async (job) => {
                const property = await Property.findById(job.propertyID);
                // const jobObj = job.toObject();
                const jobObj = {
                    job_id: job._id,
                    job_number: job.job_number,
                    approved: job.approved,
                    job_status_descrp: job.job_status_descrp,
                    contractors: job.contractors.length,
                    application_id: job.Application_id,
                }
                jobObj.property = property ? {
                    _id: property._id,
                    house_num: property.house_num,
                    street_name: property.street_name,
                    borough: property.borough,
                    zip: property.zip
                } : null;
                return jobObj;
            })
        );
        res.json(jobsWithProperties);
    } catch (error) {
        console.error("Error fetching jobs with properties:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


// GET: Paginated Jobs
router.get("/page/:page", (req, res) => {
    let pageNumber = !req.params.page || isNaN(req.params.page) ? 1 : parseInt(req.params.page);
    const perPage = 30
    const page = pageNumber || 1
    Jobs.find({})
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .then(jobs => {
            res.json(jobs)
        })
})


// GET: Paginated Jobs with custom limit
router.get("/page/:page/:limit", (req, res) => {
    let pageNumber = !req.params.page || isNaN(req.params.page) ? 1 : parseInt(req.params.page);
    const perPage = !req.params.limit || isNaN(req.params.limit) ? 30 : parseInt(req.params.limit)
    const page = pageNumber || 1
    Jobs.find({})
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .then(jobs => {
            res.json(jobs)
        })
})


// GET: Job STATUS MAP
router.get("/statusmap", (req, res) => {
    res.json(jobsStatusMap)
})
// GET: Job TYPE CODE
router.get("/types", (req, res) => {
    res.json(jobTypeCode)
})


// GET: Job by JOB NUMBER with Property and Contractors details
router.get("/number/:job_number", async (req, res) => {
    if (!req.params.job_number) {
        return res.status(400).json({ error: "Job number is required" });
    }
    try {
        const job = await Jobs.findOne({ job_number: req.params.job_number });
        if (!job) {
            return res.status(404).json({ error: "Job not found" });
        }
        const property = await Property.findById(job.propertyID);
        const contractors = await Contractor.find({ _id: { $in: job.contractors } });
        const jobInfo = { ...job.toObject() };
        jobInfo.property = property ? {
            _id: property._id,
            house_num: property.house_num,
            street_name: property.street_name,
            borough: property.borough,
            zip: property.zip
        } : null;
        jobInfo.contractors = contractors;
console.log("Job Info:", jobInfo);
        res.json(jobInfo);
    } catch (error) {
        console.error("Error fetching job:", error);
        res.status(500).json({ error: "Internal server error" });
    }
})

// GET: Job by ID with Property, Application, and Contractors details
router.get("/id/:id", async (req, res) => {
    try {
        let jobResults = {}
        const jobdetails = await Jobs.findById(req.params.id);
        if (!jobdetails) {
            return res.status(404).json({ error: "Job not found" });
        }
        
        // Load full related documents directly via their IDs; Mongoose will
        // handle ObjectId casting for strings or ObjectId instances.
        const propertyInfo = jobdetails.propertyID 
            ? await Property.findById(jobdetails.propertyID) 
            : null;
        const applicationInfo = jobdetails.application_id
            ? await Application.findById(jobdetails.application_id)
            : null;

        jobResults = { ...jobdetails.toObject() };
        jobResults.contractors = jobdetails.contractors && jobdetails.contractors.length > 0
            ? await Contractor.find({ _id: { $in: jobdetails.contractors } })
            : [];

        // Build a normalized property object containing all relevant
        // fields from models/v2/Property.js
        jobResults.property = propertyInfo
            ? {
                  _id: propertyInfo._id,
                  house_num: propertyInfo.house_num ?? "N/A",
                  street_name: propertyInfo.street_name ?? "N/A",
                  landmarked: propertyInfo.landmarked ?? "N/A",
                  property_owner_firstName: propertyInfo.property_owner_firstName ?? "N/A",
                  property_owner_lastName: propertyInfo.property_owner_lastName ?? "N/A",
                  building_type: propertyInfo.building_type ?? "N/A",
                  existing_occupancy: propertyInfo.existing_occupancy ?? "N/A",
                  owner_type: propertyInfo.owner_type ?? "N/A",
                  property_owner_business_name: propertyInfo.property_owner_business_name ?? "N/A",
                  non_profit: propertyInfo.non_profit ?? "N/A",
                  proptertyID: propertyInfo.proptertyID ?? "N/A",
                  borough: propertyInfo.borough ?? "N/A",
                  community___board: propertyInfo.community___board ?? "N/A",
                  ownerID: propertyInfo.ownerID ?? "N/A",
              }
            : null;

        jobResults.application = applicationInfo ? applicationInfo : null;
console.log("Job Results:", jobResults);
        res.json(jobResults);
      
    } catch (error) {
        console.error("Error fetching job by ID:", error);
        res.status(500).json({ error: "Internal server error" });
    }
})

// GET: Jobs by JOB NUMBER
router.get("/jobid/:job_number", async (req, res) => {
    try {
        const jobs = await Jobs.find({ job_number: req.params.job_number });
        res.json(jobs);
    } catch (error) {
        console.error("Error fetching job by job number:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
        // const fullJobInfo = {}
// PUT edit Job by ID
router.put("/edit/:id", async (req, res) => {
    try {
        const jobId = req.params.id;
        const updateData = req.body;

        const updatedJob = await Jobs.findByIdAndUpdate(jobId, updateData, { new: true });

        if (!updatedJob) {
            return res.status(404).json({ error: "Job not found" });
        }

        res.json({
            message: "Job updated successfully",
            job: updatedJob
        });
    } catch (error) {
        console.error("Error updating job:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});



// Post: Add New Job
router.post("/add", async (req, res) => {
    console.log(req.body);
    try {
        const {
            job_number,
            prefiling_date,
            paid,
            latest_action_date,
            fully_permitted,
            job_description,
            job_status,
            job_type,
            other_description,
            propertyID,
            application_num,
            application_id,
            applicant_firstName,
            applicant_lastName,
            applicant_title,
            applicant_license,
            contractors,
            Property_proptertyID,
            approved_date,
            approved,
            initial_cost,
            total_est__fee,
            professional_cert,
            job_status_descrp
        } = req.body;

        if (!job_number) {
            return res.status(400).json({ error: "Job number is required" });
        }

        const isValidObjectId = (id) => {
            return id && typeof id === 'string' && /^[a-fA-F0-9]{24}$/.test(id);
        };

        const existingJob = await Jobs.findOne({ job_number });
        if (existingJob) {
            return res.status(409).json({ error: "Job with this job number already exists" });
        }

        if (propertyID) {
            if (!isValidObjectId(propertyID)) {
                return res.status(400).json({ error: "Invalid property ID format" });
            }
            const property = await Property.findById(propertyID);
            if (!property) {
                return res.status(400).json({ error: "Property ID not found" });
            }
        }

        // Determine or create related application ("applicant")
        let applicationDoc = null;

        if (application_id) {
            if (!isValidObjectId(application_id)) {
                return res.status(400).json({ error: "Invalid application ID format" });
            }

            applicationDoc = await Application.findById(application_id);
            if (!applicationDoc) {
                return res.status(400).json({ error: "Invalid application ID" });
            }
        } else if (applicant_license) {
            // Find or create an application by license (similar to db/v2/seed.js)
            applicationDoc = await Application.findOne({ applicant_license });

            if (!applicationDoc) {
                const appData = {
                    applicant_firstName: applicant_firstName || null,
                    applicant_lastName: applicant_lastName || null,
                    applicant_title: applicant_title || null,
                    applicant_license,
                    job_listing: [],
                };

                applicationDoc = new Application(appData);
                await applicationDoc.save();
            }
        }

        if (contractors && contractors.length > 0) {
            const validContractors = await Contractor.find({ _id: { $in: contractors } });
            if (validContractors.length !== contractors.length) {
                return res.status(400).json({ error: "One or more contractor IDs are invalid" });
            }
        }

        const newJob = new Jobs({
            job_number,
            prefiling_date,
            paid,
            latest_action_date,
            fully_permitted,
            job_description,
            job_status,
            job_type,
            other_description,
            propertyID,
            application_num,
            application_id: applicationDoc ? applicationDoc._id : application_id,
            contractors: contractors || [],
            Property_proptertyID,
            approved_date,
            approved: approved || false,
            initial_cost: initial_cost || 0,
            total_est__fee: total_est__fee || 0,
            professional_cert,
            job_status_descrp
        });

        const savedJob = await newJob.save();

        // If we have an associated application, update its job_listing
        if (applicationDoc) {
            const jobNum = savedJob.job_number;
            if (jobNum && !applicationDoc.job_listing.includes(jobNum)) {
                applicationDoc.job_listing.push(jobNum);
                await applicationDoc.save();
            }
        }
        res.status(201).json({
            message: "Job created successfully",
            job: savedJob
        });
    } catch (error) {
        console.error("Error adding job:", error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ error: "Internal server error" });
    }
});

// GET: all jobs
router.get("/all", async (req, res) => {
    try {
        const jobs = await Jobs.find()
res.json(jobs);
    }
    catch (error) {
        console.error("Error fetching all jobs:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.get("/full", async (req, res) => {
    try {
        const jobs = await Jobs.find();
        const jobsWithProperties = await Promise.all(
            jobs.map(async (job) => {
                const property = await Property.findById(job.propertyID);
                const jobObj = job.toObject();
                jobObj.property = property ? {
                    _id: property._id,
                    house_num: property.house_num,
                    street_name: property.street_name,
                    borough: property.borough,
                    zip: property.zip
                } : null;
                return jobObj;
            })
        );
        res.json(jobsWithProperties);
    } catch (error) {
        console.error("Error fetching jobs with properties:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


router.get("/newjobnumber", async (req, res) => {
   
    // go through job_number and then return a create new job_number 
    try {
        const lastJob = await Jobs.findOne().sort({ job_number: -1 });
        let newJobNumber = 1;
        if (lastJob && lastJob.job_number) {
            newJobNumber = parseInt(lastJob.job_number) + 1;
        }
        console.log("New Job Number Generated:", newJobNumber.toString().padStart(6, '0'));
        console.log(newJobNumber);
        res.json({ newJobNumber: newJobNumber.toString().padStart(6, '0') });
    } catch (error) {
        console.error("Error generating new job number:", error);
        res.status(500).json({ error: "Internal server error" });
    }   
});

module.exports = router