const express = require("express");
const router = express.Router();
const Contractor = require('../models/Contractor')

router.get("/", (req, res) => {
    Contractor.find().then(contractor => {
        res.json(contractor)
    })
})

router.get("/name/:conLastName", (req, res) => {
    Contractor.find({ conLastName: req.params.conLastName }.then(lastName => res.json(lastName)))
})
module.exports = router