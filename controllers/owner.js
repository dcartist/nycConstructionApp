const express = require("express");
const router = express.Router();
const Owner = require('../models/Owner.js')

router.get("/", (req, res) => {
    Owner.find().then(owner => {
        res.json(owner)
    })
})

router.get("/name/:ownLastName", (req, res) => {
    let theName = req.params.ownLastName
    Owner.find({ ownLastName: theName }).then(showName => res.json(showName))
})
router.get("/type/:info", (req, res) => {
    let theName = req.params.info
    Owner.find({ ownType: theName }).then(showName => res.json(showName))
})


router.post("/new", (req, res) => {
    Owner.create(req.body).then(owner => res.json(owner))
})

router.put("/update/:id", (req, res) => {
    Owner.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })
        .then(update => res.json(update))
})

router.delete("/delete/:id", (req, res) => {
    Owner.findOneAndDelete({ _id: req.params.id }).then(deleted => res.json(deleted))
})


module.exports = router