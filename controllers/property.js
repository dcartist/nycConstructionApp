const express = require("express");
const router = express.Router();
const Property = require('../models/Property.js')

router.get("/", (req, res) => {
    Property.find().then(property => {
        res.json(property)
    })
})

router.get("/borough/:borough", (req, res) => {
    let theName = req.params.borough
    Property.find({ borough: theName }).then(showName => res.json(showName))
})
router.get("/city/:info", (req, res) => {
    let theName = req.params.info
    Property.find({ city: theName }).then(showName => res.json(showName))
})
router.get("/address/:address", (req, res) => {
    let theName = req.params.address
    Property.find({ address: theName }).then(showName => res.json(showName))
})
router.get("/streetnumber/:propNum", (req, res) => {
    let theName = req.params.propNum
    Property.find({ propNum: theName }).then(showName => res.json(showName))
})

router.post("/new", (req, res) => {
    Property.create(req.body).then(property => res.json(property))
})

router.put("/update/:id", (req, res) => {
    Property.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })
        .then(update => res.json(update))
})

router.delete("/delete/:id", (req, res) => {
    Property.findOneAndDelete({ _id: req.params.id }).then(deleted => res.json(deleted))
})


module.exports = router