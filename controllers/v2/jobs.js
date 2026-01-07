const express = require("express");
const router = express.Router();
const Property = require('../../models/v2/Property.js')
const Contractor = require('../../models/v2/Contractor.js')
const Jobs = require('../../models/v2/Jobs.js')
const Application = require('../../models/v2/Application.js')


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

router.get("/statusmap", (req, res) => {
    res.json(jobsStatusMap)
})
//
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

        res.json(jobInfo);
    } catch (error) {
        console.error("Error fetching job:", error);
        res.status(500).json({ error: "Internal server error" });
    }
})

router.get("/id/:id", async (req, res) => {
    try {
        let jobResults = {}
        const jobdetails = await Jobs.findById(req.params.id);
        if (!jobdetails) {
            return res.status(404).json({ error: "Job not found" });
        }
        
        // Helper function to check if a string is a valid ObjectId
        const isValidObjectId = (id) => {
            return id && typeof id === 'string' && /^[a-fA-F0-9]{24}$/.test(id);
        };
        
        const propertyInfo = isValidObjectId(jobdetails.propertyID) 
            ? await Property.findById(jobdetails.propertyID) 
            : null;
        const applicationInfo = isValidObjectId(jobdetails.application_id) 
            ? await Application.findById(jobdetails.application_id) 
            : null;
            
        jobResults = { ...jobdetails.toObject() };
        jobResults.contractors = jobdetails.contractors && jobdetails.contractors.length > 0
            ? await Contractor.find({ _id: { $in: jobdetails.contractors.filter(isValidObjectId) } })
            : [];
        jobResults.property = propertyInfo ? propertyInfo : null;
        jobResults.application = applicationInfo ? applicationInfo : null;

        res.json(jobResults);
      
    } catch (error) {
        console.error("Error fetching job by ID:", error);
        res.status(500).json({ error: "Internal server error" });
    }
})

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


//adding a new job
router.post("/add", async (req, res) => {
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
            contractors,
            Property_proptertyID,
            approved_date,
            approved,
            initial_cost,
            total_est__fee,
            professional_cert,
            job_status_descrp
        } = req.body;

        // Validate required fields
        if (!job_number) {
            return res.status(400).json({ error: "Job number is required" });
        }

        // Check if job already exists
        const existingJob = await Jobs.findOne({ job_number });
        if (existingJob) {
            return res.status(409).json({ error: "Job with this job number already exists" });
        }

        // Validate propertyID if provided
        if (propertyID) {
            const property = await Property.findById(propertyID);
            if (!property) {
                return res.status(400).json({ error: "Invalid property ID" });
            }
        }

        // Validate application_id if provided
        if (application_id) {
            const application = await Application.findById(application_id);
            if (!application) {
                return res.status(400).json({ error: "Invalid application ID" });
            }
        }

        // Validate contractors if provided
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
            application_id,
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


module.exports = router