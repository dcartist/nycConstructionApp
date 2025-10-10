const Contractor = require('../../models/v2/Contractor.js')
const Jobs = require('../../models/v2/Jobs.js')
const Metadata = require('../../models/v2/Metadata.js')
const Application = require('../../models/v2/Application.js')
const express = require("express");
const router = express.Router();



router.get("/", (req, res) => {
    Contractor.find().then(contractors => {
        res.json(contractors)
    })
})

router.get("/page/:page", (req, res) => {
    let pageNumber = !req.params.page || isNaN(req.params.page) ? 1 : parseInt(req.params.page);
    const perPage = 30
    const page = pageNumber || 1
    Contractor.find({})
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .then(contractor => {
            res.json(contractor)
        })
})

router.get("/id/:contractorID", async (req, res) => {
    if (!req.params.contractorID) {
        return res.status(400).json({ error: "Contractor ID is required" });
    }
    try {
        const contractor = await Contractor.findById({ _id: req.params.contractorID });
        if (!contractor) {
            return res.status(404).json({ error: "Contractor not found" });
        }
        const jobs = await Jobs.find({ contractors: { $in: [req.params.contractorID] } });
        const contractorInfo = { ...contractor.toObject() };

        contractorInfo.jobs = jobs;

        res.json(contractorInfo);
    } catch (error) {
        console.error("Error fetching contractor:", error);
        res.status(500).json({ error: "Internal server error" });
    }
})

router.get("/license/number/:license_number", (req, res) => {
    Contractor.find({ license_number: req.params.license_number }).then(contractors => {
        res.json(contractors)
    })
})

router.get("/license/status/:status", (req, res) => {
    Contractor.find({ license_status: req.params.status }).then(contractors => {
        res.json(contractors)
    })
})


router.put("/edit/:contractorID", async (req, res) => {
    try {
        const updatedContractor = await Contractor.findByIdAndUpdate(
            req.params.contractorID,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedContractor) {
            return res.status(404).json({ error: "Contractor not found" });
        }
        res.json(updatedContractor);
    } catch (error) {
        console.error("Error updating contractor:", error);
        res.status(500).json({ error: "Internal server error" });
    }
})
// the list of license status types
router.get("/license/types", async (req, res) => {
    res.json([
        "ACTIVE",
        "CERTIFICATE",
        "DECEASED",
        "DENIED",
        "EXPIRED",
        "INACTIVE",
        "OBSOLETE",
        "ON HOLD",
        "RESTRICTED",
        "RETIRED",
        "REVIEW PENDING",
        "SURRENDERED"
    ])
    // the list of license status types via database
    // try {
    //     const statuses = await Contractor.distinct("license_status");
    //     console.log("License statuses:", statuses);
    //     res.json(statuses);
    // } catch (error) {   
    //     console.error("Error fetching license status types:", error);
    //     res.status(500).json({ error: "Internal server error" });
    // }
})

//Adding Contractors into the database
router.post("/add", async (req, res) => {
    const newContractor = new Contractor(req.body);
    try {
        const savedContractor = await newContractor.save();
        res.status(201).json(savedContractor);
    } catch (error) {
        console.error("Error adding contractor:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


module.exports = router