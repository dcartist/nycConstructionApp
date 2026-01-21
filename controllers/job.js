const express = require("express");
const router = express.Router();
const Property = require('../models/Property.js')
const Contractor = require('../models/Contractor.js')
const Jobs = require('../models/Jobs.js')
const Owner = require('../models/Owner.js')

router.get("/", (req, res) => {
  console.log("Fetching all jobs with populated fields");

// res.send("Fetching all jobs with populated fields");
Jobs.find().then(async (jobs) => {
  res.json(jobs);
}).catch(err => {
  console.error("Error fetching jobs:", err);
  res.status(500).json({ error: "An error occurred while fetching jobs." });
});
  // Jobs.find()
  //     .populate("property")
  //     .populate("owner")
  //     .populate("contractor")
  //     .then(jobs => {
  //         console.log(`Found ${jobs.length} jobs`);
  //         res.json(jobs);
  //     })
  //     .catch(err => {
  //         console.error("Error fetching jobs:", err);
  //         res.status(500).json({ error: "An error occurred while fetching jobs." });
  //     }); 

})


router.get("/all", (req, res) => {
  Jobs.find()
      .then(jobs => {
          res.json(jobs)
      })
      .catch(err => {
          console.error("Error fetching jobs:", err);
          res.status(500).json({ error: "An error occurred while fetching jobs." });
      }); 
})


router.get("/count", (req, res) => {
  Jobs.countDocuments()
      .then(count => res.json({ count }))
      .catch(err => res.status(500).json({ error: 'An error occurred while counting jobs.' }));
});


router.get("/id/:jobId", async (req, res) => {
  try {
    const results = {};
    results.contractor = await Contractor.findOne({ jobId: req.params.jobId });
    results.property   = await Property.findOne({ jobId: req.params.jobId });
    results.owner      = await Owner.findOne({ jobId: req.params.jobId });

    if (!results.contractor && !results.property && !results.owner) {
      return res.status(404).json({ error: "Job not found" });
    }
    return res.json([results]); // ensure only one response
  } catch (err) {
    console.error("Error fetching job by jobId:", err);
    return res.status(500).json({ error: "An error occurred while fetching the job." });
  }
});


module.exports = router