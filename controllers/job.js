const express = require("express");
const router = express.Router();
const Property = require('../models/Property.js')
const Contractor = require('../models/Contractor.js')
const Jobs = require('../models/Jobs.js')
const Owner = require('../models/Owner.js')

router.get("/", (req,res) => {
    res.send("Welcome")
})

router.get("/:jobId", (req, res) => {

    // let finalResults = {}
    Contractor.find({  jobId: req.params.jobId }).then( results => {
       let finalResults = Object.assign({}, results)
    //    res.json(finalResults)
    return finalResults
    })
    Property.find({  jobId: req.params.jobId }).then(  results => {
        let finalResults1 = Object.assign(results)
        let mainResults = typeof finalResults1
       res.send(mainResults)
    }).catch(err => res.send(err))
    // Owner.find({  jobId: req.params.jobId }).then(  results => {
    //     finalResults = {...results}
    // }).then(res.json(finalResults))

})
// router.get("/", (req, res) => {
//     Jobs.find()
//         .populate("property")
//         .populate("owner")
//         .populate("contractor")
//         .then(jobs => {
//             res.json(jobs)
//         })
// })


// router.get("/id/:jobId", (req, res) => {
//     let thejob = req.params.jobId
//     Jobs.find({ jobId: thejob })
//         .populate("contractor")
//         .populate("property")
//         .populate("owner")
//         .then(showinfo => res.json(showinfo))
// })


module.exports = router