const express = require("express");
const router = express.Router();
const Property = require('../models/Property')
const Contractor = require('../models/Contractor')
const JobsFull = require('../models/JobsFull')
const Owner = require('../models/Owner')

router.get("/", (req, res) => {
    JobsFull.find()
        .populate("property")
        .populate("owner")
        .populate("contractor")
        .then(jobs => {
            res.json(jobs)
        })
})


router.get("/id/:jobId", (req, res) => {
    let thejob = req.params.jobId
    JobsFull.find({ jobId: thejob })
        .populate("contractor")
        .populate("property")
        .populate("owner")
        .then(showinfo => res.json(showinfo))
})


module.exports = router