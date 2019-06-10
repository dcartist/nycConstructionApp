const express = require("express");
const router = express.Router();
const Property = require('../models/Property.js')
const Contractor = require('../models/Contractor.js')
const Jobs = require('../models/Jobs.js/index.js')
const Owner = require('../models/Owner.js')

router.get("/", (req, res) => {
    Jobs.find()
        .populate("property")
        .populate("owner")
        .populate("contractor")
        .then(jobs => {
            res.json(jobs)
        })
})


router.get("/id/:jobId", (req, res) => {
    let thejob = req.params.jobId
    Jobs.find({ jobId: thejob })
        .populate("contractor")
        .populate("property")
        .populate("owner")
        .then(showinfo => res.json(showinfo))
})


module.exports = router