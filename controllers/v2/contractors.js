const express = require("express");
const router = express.Router();
const Contractor = require('../../models/v2/Contractor.js')
const Jobs = require('../../models/v2/Jobs.js')
const Metadata = require('../../models/v2/Metadata.js')
const Application = require('../../models/v2/Application.js')

const licenseTypes = [
     "Active",
  "Expired",
  "Ready for Renewal",
  "Surrendered",
  "Failed to Renew",
  "Revoked",
  "Voided",
  "Suspended",
  "Out of Business",
  "Close"
]



router.get("/", async (req, res) => {
    try {
        const contractors = await Contractor.find();
        res.json(contractors);
    } catch (error) {
        console.error("Error fetching contractors:", error);
        res.status(500).json({ error: "Internal server error" });
    }
})


router.get("/shortlist/", async (req, res) => {
    try {
        const contractors = await Contractor.find({}, { first_name: 1, last_name: 1, license_sl_no: 1, license_type: 1 });
        res.json(contractors);
    } catch (error) {
        console.error("Error fetching shortlist:", error);
        res.status(500).json({ error: "Internal server error" });
    }
})  


router.get("/page/:page", async (req, res) => {
    try {
        let pageNumber = !req.params.page || isNaN(req.params.page) ? 1 : parseInt(req.params.page);
        const perPage = 30;
        const page = pageNumber || 1;
        
        const contractors = await Contractor.find({})
            .skip((perPage * page) - perPage)
            .limit(perPage);
        
        res.json(contractors);
    } catch (error) {
        console.error("Error fetching paginated contractors:", error);
        res.status(500).json({ error: "Internal server error" });
    }
})

// Generic search endpoint for contractors
// Usage examples:
//   GET /api/v2/contractors/search/Smith
//   GET /api/v2/contractors/search/Smith?page=1&limit=50
router.get("/search/:inputedData", async (req, res) => {
    const q = req.params.inputedData || req.query.q;
    const page = !req.query.page || isNaN(req.query.page) ? 1 : parseInt(req.query.page);
    const limit = !req.query.limit || isNaN(req.query.limit) ? 30 : parseInt(req.query.limit);

    if (!q || typeof q !== "string") {
        return res.status(400).json({ error: "Search term is required" });
    }

    try {
        const searchRegex = new RegExp(q, "i");

        const query = {
            $or: [
                { first_name: searchRegex },
                { last_name: searchRegex },
                { license_number: searchRegex },
                { company_name: searchRegex },
                { license_type: searchRegex },
                { license_status: searchRegex }
            ]
        };

        const contractors = await Contractor.find(query)
            .skip((page - 1) * limit)
            .limit(limit);

        res.json(contractors);
    } catch (error) {
        console.error("Error searching contractors:", error);
        res.status(500).json({ error: "Internal server error" });
    }
})

// Keep the old search route for backward compatibility
router.get("/search/:searchTerm/page/:page", async (req, res) => {
    try {
        let pageNumber = !req.params.page || isNaN(req.params.page) ? 1 : parseInt(req.params.page);
        const perPage = 30;
        const page = pageNumber || 1;
        let searchTerm = req.params.searchTerm;
        const searchRegex = new RegExp(searchTerm, 'i');

        const contractors = await Contractor.find({
            $or: [
                { first_name: searchRegex }, 
                { last_name: searchRegex },
                { license_number: searchRegex },
                { company_name: searchRegex }
            ]
        })
            .skip((perPage * page) - perPage)
            .limit(perPage);
        
        res.json(contractors);
    } catch (error) {
        console.error("Error searching contractors:", error);
        res.status(500).json({ error: "Internal server error" });
    }
})

router.get("/id/:contractorID", async (req, res) => {
    try {
        if (!req.params.contractorID) {
            return res.status(400).json({ error: "Contractor ID is required" });
        }

        const contractor = await Contractor.findById(req.params.contractorID);
        if (!contractor) {
            return res.status(404).json({ error: "Contractor not found" });
        }

        res.json(contractor);
    } catch (error) {
        console.error("Error fetching contractor by ID:", error);
        res.status(500).json({ error: "Internal server error" });
    }
})

router.get("/id/:contractorID/full", async (req, res) => {
    try {
        if (!req.params.contractorID) {
            return res.status(400).json({ error: "Contractor ID is required" });
        }

        const contractor = await Contractor.findById(req.params.contractorID);
        if (!contractor) {
            return res.status(404).json({ error: "Contractor not found" });
        }

        const jobs = await Jobs.find({ contractors: { $in: [req.params.contractorID] } });
        const contractorInfo = { ...contractor.toObject() };
        contractorInfo.jobs = jobs;

        res.json(contractorInfo);
    } catch (error) {
        console.error("Error fetching contractor with jobs:", error);
        res.status(500).json({ error: "Internal server error" });
    }
})

router.get("/license/number/:license_number", async (req, res) => {
    try {
        const contractors = await Contractor.find({ license_number: req.params.license_number });
        res.json(contractors);
    } catch (error) {
        console.error("Error fetching contractors by license number:", error);
        res.status(500).json({ error: "Internal server error" });
    }
})

router.get("/license/status/:status", async (req, res) => {
    try {
        const contractors = await Contractor.find({ license_status: req.params.status });
        res.json(contractors);
    } catch (error) {
        console.error("Error fetching contractors by status:", error);
        res.status(500).json({ error: "Internal server error" });
    }
})

router.get("/license/types", async (req, res) => {
    res.json(licenseTypes);
})


// edit/update a contractor and keep related jobs in sync
router.put("/edit/:id", async (req, res) => {
    try {
        const contractorId = req.params.id;
        const contractor = await Contractor.findById(contractorId);
        
        if (!contractor) {
            return res.status(404).json({ error: "Contractor not found" });
        }

        const {
            first_name,
            last_name,
            license_number,
            license_type,
            license_status,
            company_name
        } = req.body;

        // Update basic fields if provided
        if (typeof first_name === "string") contractor.first_name = first_name;
        if (typeof last_name === "string") contractor.last_name = last_name;
        if (typeof license_number === "string") contractor.license_number = license_number;
        if (typeof license_type === "string") contractor.license_type = license_type;
        if (typeof license_status === "string") contractor.license_status = license_status;
        if (typeof company_name === "string") contractor.company_name = company_name;

        // If no jobs array was provided, only update contractor fields
        const jobsFromBody = req.body.jobs;
        if (typeof jobsFromBody === "undefined") {
            const updatedContractor = await contractor.save();
            console.log("Updated contractor (no job changes):", updatedContractor);
            return res.json(updatedContractor);
        }

        // Normalize incoming job IDs
        let newJobIds;
        if (Array.isArray(jobsFromBody)) {
            newJobIds = jobsFromBody.map((id) => (id != null ? String(id) : id)).filter(Boolean);
        } else if (typeof jobsFromBody === "string") {
            newJobIds = jobsFromBody
                .split(",")
                .map((id) => id.trim())
                .filter(Boolean);
        } else {
            newJobIds = [];
        }

        // Find the Job documents for the incoming IDs
        const newJobs = newJobIds.length
            ? await Jobs.find({ _id: { $in: newJobIds } })
            : [];

        const newJobIdSet = new Set(newJobs.map((j) => j._id.toString()));

        // Find currently associated jobs
        const currentJobs = await Jobs.find({ contractors: { $in: [contractorId] } });
        const currentJobIds = currentJobs.map((j) => j._id.toString());

        const removedJobIds = currentJobIds.filter((id) => !newJobIdSet.has(id));
        const addedJobIds = Array.from(newJobIdSet).filter((id) => !currentJobIds.includes(id));

        // Remove contractor from jobs that are no longer associated
        if (removedJobIds.length > 0) {
            await Jobs.updateMany(
                { _id: { $in: removedJobIds } },
                { $pull: { contractors: contractorId } }
            );
        }

        // Add contractor to new jobs
        if (addedJobIds.length > 0) {
            await Jobs.updateMany(
                { _id: { $in: addedJobIds } },
                { $addToSet: { contractors: contractorId } }
            );
        }

        const updatedContractor = await contractor.save();
        console.log("Updated contractor:", updatedContractor);
        res.json(updatedContractor);
    } catch (error) {
        console.error("Error updating contractor:", error);
        res.status(500).json({ error: "Internal server error" });
    }
})

// Keep old edit route for backward compatibility
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