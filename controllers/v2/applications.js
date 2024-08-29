const express = require("express");
const router = express.Router();
const Property = require('../../models/v2/Property.js')
const Contractor = require('../../models/v2/Contractor.js')
const Jobs = require('../../models/v2/Jobs.js')
const Application = require('../../models/v2/Application.js')

router.get("/", (req, res) => {
    Application.find().then(jobs => {
              res.json(jobs)
         })
    })

// main router with pagination
router.get("/page/:page", (req, res) => {
    const perPage = 30
    const page = req.params.page || 1
    Application.find({})
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .then(jobs => {
            res.json(jobs)
        })
})

// find by applicant_license
router.get("/license/:applicant_license", (req, res) => {
    Application.find({applicant_license: req.params.applicant_license}).then(jobs => {
        res.json(jobs)
    })
})
router.get("/license/:applicant_license/full", (req, res) => {
    Application.find({applicant_license: req.params.applicant_license}).then(jobs => {
        res.json(jobs)

    })
})



module.exports = router