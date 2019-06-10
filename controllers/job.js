const express = require("express");
const router = express.Router();
const Property = require('../models/Property.js')
const Contractor = require('../models/Contractor.js')
const JobsFull = require('../models/JobsFull.js')
const Owner = require('../models/Owner.js')

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