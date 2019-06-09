const express = require("express");
const router = express.Router();
// const Contractor = require('../models/Contractor')
const Property = require('../models/Property')
const Contractor = require('../models/Contractor')
const JobsFull = require('../models/jobsFull')
const Owner = require('../models/Owner')

router.get("/", (req, res) => {
    JobsFull.find().then(jobs => {
        res.json(jobs)
    })
})


router.get("/id/:jobId", (req, res) => {
    let thejob = req.params.jobId
    Contractor.find({ jobId: thejob }).then(showName => res.json(showName))
})

router.post("/new", (req, res) => {
    Contractor.create(req.body).then(contractor => res.json(contractor))
})

router.put("/update/:id", (req, res) => {
    Contractor.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })
        .then(update => res.json(update))
})

router.delete("/delete/:id", (req, res) => {
    Contractor.findOneAndDelete({ _id: req.params.id }).then(deleted => res.json(deleted))
})



module.exports = router