const express = require("express");
const router = express.Router();
const Contractor = require('../models/Contractor.js')

router.get("/", (req, res) => {
    Contractor.find().then(contractor => {
        res.json(contractor)
    })
})

router.get("/name/:conLastName", (req, res) => {
    let theName = req.params.conLastName
    Contractor.find({ conLastName: theName }).then(showName => res.json(showName))
})
router.get("/id/:id", (req, res) => {
    let theName = req.params.conLastName
    Contractor.find({  _id: req.params.id }).then(showName => res.json(showName))
})
router.get("/license/:conLicense", (req, res) => {
    let license = req.params.conLicense
    Contractor.find({  conLicense: license }).then(results => res.json(results))
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