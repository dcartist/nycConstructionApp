const express = require("express");
const router = express.Router();
const Property = require('../../models/v2/Property.js')
const Contractor = require('../../models/v2/Contractor.js')
const Jobs = require('../../models/v2/Jobs.js')



router.get("/", async (req, res) => {
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

router.get("/id/:job_number", (req, res) => {
    Jobs.find({ job_number: req.params.job_number }).then(jobs => {
        res.json(jobs)
    })
})

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


module.exports = router