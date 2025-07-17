const express = require("express");
const router = express.Router();
const Property = require('../../models/v2/Property.js')
const Contractor = require('../../models/v2/Contractor.js')
const Jobs = require('../../models/v2/Jobs.js')
const Application = require('../../models/v2/Application.js')



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
        const propertyInfo = await Property.findById(jobdetails.propertyID);
        const applicationInfo = await Application.findById(jobdetails.application_id);
        jobResults = { ...jobdetails.toObject() };
        jobResults.contractors = await Contractor.find({ _id: { $in: jobdetails.contractors } });
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
    const newJob = new Jobs(req.body);
    try {
        const savedJob = await newJob.save();
        res.status(201).json(savedJob);
    } catch (error) {
        console.error("Error adding job:", error);
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