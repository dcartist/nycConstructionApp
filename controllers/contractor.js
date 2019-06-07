const express = require("express");
const router = express.Router();
const Contractor = require('../models/Contractor')

router.get('/', (req, res) => {
    Contractor.find({}).then(contractor => {
        res.send(contractor)
    })
})