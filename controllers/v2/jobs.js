const express = require("express");
const router = express.Router();
const Property = require('../../models/v2/Property.js')
const Contractor = require('../../models/v2/Contractor.js')
const Jobs = require('../../models/v2/Jobs.js')



router.get("/", (req, res) => {
    Jobs.find().then(jobs => {
              res.json(jobs)
         })
    }) 

router.get("/:job_number", (req, res) => {
    Jobs.find({job_number: req.params.job_number}).then(jobs => {
        res.json(jobs)
    })
})


    
module.exports = router