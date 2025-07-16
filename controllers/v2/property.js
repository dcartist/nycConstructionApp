const express = require("express");
const router = express.Router();
const Property = require('../../models/v2/Property.js')
const Contractor = require('../../models/v2/Contractor.js')
const Jobs = require('../../models/v2/Jobs.js')
const Application = require('../../models/v2/Application.js')


router.get("/", (req, res) => {
    Property.find().then(jobs => {
        res.json(jobs)
    })
})
router.get("/page/:page", (req, res) => {
    let pageNumber = !req.params.page || isNaN(req.params.page) ? 1 : parseInt(req.params.page);
    const perPage = 30
    const page = pageNumber || 1
    Property.find({})
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .then(properties => {
            res.json(properties)
        })
})

router.get("/id/:propertyID", async (req, res) => {
    if (!req.params.propertyID) {
        return res.status(400).json({ error: "Property ID is required" });
    }
    let propertyInfo = {}
    try {
        const property = await Property.findById({ _id: req.params.propertyID });
        if (!property) {
            return res.status(404).json({ error: "Property not found" });
        }
        const jobs = await Jobs.find({ propertyID: req.params.propertyID });

        propertyInfo = { ...property.toObject() };

        propertyInfo.jobs = jobs;

        res.json(propertyInfo);
    } catch (error) {
        console.error("Error fetching property:", error);
        res.status(500).json({ error: "Internal server error" });
    }

})

router.get("/borough/:borough", (req, res) => {
    Property.find({ borough: req.params.borough }).then(jobs => {
        res.json(jobs)
    })
})

router.get("/street/:street_name", (req, res) => {
    Property.find({ street_name: req.params.street_name }).then(jobs => {
        res.json(jobs)
    })
})

router.get("/house/:house_num", (req, res) => {
    Property.find({ house_num: req.params.house_num }).then(jobs => {
        res.json(jobs)
    })
})

router.put("/edit/:propertyID", async (req, res) => {
    try {
        const updatedProperty = await Property.findByIdAndUpdate(
            req.params.propertyID,
            req.body,
            { new: true }
        );
        if (!updatedProperty) {
            return res.status(404).json({ error: "Property not found" });
        }
        res.json(updatedProperty);
    } catch (error) {
        console.error("Error updating property:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
// router.get("/:job_number", (req, res) => {
//     Jobs.find({job_number: req.params.job_number}).then(jobs => {
//         res.json(jobs)
//     })
// })

//adding a new property
router.post("/add", async (req, res) => {
    const newProperty = new Property(req.body);
    try {
        const savedProperty = await newProperty.save();
        res.status(201).json(savedProperty);                
    } catch (error) {
        console.error("Error adding property:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


module.exports = router