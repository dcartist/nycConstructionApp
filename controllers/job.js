const express = require("express");
const router = express.Router();
const Property = require('../models/Property.js')
const Contractor = require('../models/Contractor.js')
const Jobs = require('../models/Jobs.js')
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
router.get("/id/:id", (req, res) => {
  let thejob = req.params.jobId
  Jobs.find({ jobId: thejob })
      .populate("contractor")
      .populate("property")
      .populate("owner")
      .then(showinfo => res.json(showinfo))
})

router.get("/count", (req, res) => {
  Jobs.countDocuments()
      .then(count => res.json({ count }))
      .catch(err => res.status(500).json({ error: 'An error occurred while counting jobs.' }));
});


// router.get("/", (req,res) => {
//     res.send("Welcome")
// })
// let resultObj = {}
// let  insertObj = (objName) => {
//     Object.keys(objName).forEach((item, index) => resultObj[item]=objName[item])
//     return resultObj
//  }
  


// router.get("/:jobId", (req, res) => {

//     Contractor.find({  jobId: req.params.jobId }).then( results => {
//        insertObj(results)
//     })
//     Owner.find({  jobId: req.params.jobId }).then( results => {
//       return insertObj(results)
//     })
//     Property.find({  jobId: req.params.jobId }).then( results => {
//       insertObj(results)
//     }).then(
//         res.json(resultObj)
//     ).catch(err => res.send(err))
    

// })
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