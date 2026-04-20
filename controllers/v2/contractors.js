const express = require("express");
const router = express.Router();
const Contractor = require('../../models/v2/Contractor.js')
const Jobs = require('../../models/v2/Jobs.js')
const Metadata = require('../../models/v2/Metadata.js')
const Application = require('../../models/v2/Application.js')
const Property = require('../../models/v2/Property.js')

const license_status = [
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

const licenseTypes = [
  "Concrete Safety Manager",
  "Concrete Testing Laboratory",
  "Construction Superintendent",
  "Contractor",
  "Electrician",
  "Elevator Licenses & Helper Card",
  "Filing Representative",
  "Gas Work Qualification",
  "General Contractor Registration",
  "High Pressure Boiler Operating Engineer",
  "Hoisting Machine Operator",
  "Limited Hoisting Machine Operator",
  "Lift Director Registration",
  "N/A",
  "Not Licensed",
  "Nursery Registration",
  "Oil Burner Equipment Installer",
  "Operating Engineer",
  "Other",
  "Plumber",
  "Plumbing and Fire Suppression (Master and Journeyman)",
  "Professional/Inter-Agency Identification Card",
  "Rigger",
  "Safety Registration",
  "Sign Hanger",
  "Site Safety Professional",
  "Special Inspection Agency",
  "Welder"
]

/**
 * @swagger
 * /api/v2/contractors:
 *   get:
 *     summary: Get all contractors
 *     tags: [Contractors]
 *     description: Retrieve all contractors from the database
 *     responses:
 *       200:
 *         description: List of all contractors
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Contractor'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get("/", async (req, res) => {
    try {
        const contractors = await Contractor.find();
        res.json(contractors);
    } catch (error) {
        console.error("Error fetching contractors:", error);
        res.status(500).json({ error: "Internal server error" });
    }
})

// edit/update a contractor using the model fields directly
router.put("/edit/:_id", async (req, res) => {
    console.log("Contractor update request body:", req.body);

    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                error: "Request body is empty. Ensure Content-Type is application/json."
            });
        }

        const contractorId = req.params._id;

        // Only allow fields that exist on the Contractor model
        const modelFields = Object.keys(Contractor.schema.paths).filter(
            (field) => !["_id", "__v"].includes(field)
        );

        const updatePayload = {};
        modelFields.forEach((field) => {
            if (Object.prototype.hasOwnProperty.call(req.body, field)) {
                updatePayload[field] = req.body[field];
            }
        });

        console.log("Contractor update payload:", updatePayload);

        const updatedContractor = await Contractor.findByIdAndUpdate(
            contractorId,
            { $set: updatePayload },
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

/**
 * @swagger
 * /api/v2/contractors/shortlist:
 *   get:
 *     summary: Get contractors shortlist
 *     tags: [Contractors]
 *     description: Retrieve a condensed list of contractors with only essential fields (first_name, last_name, license_sl_no, license_type)
 *     responses:
 *       200:
 *         description: Shortlist of contractors
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   first_name:
 *                     type: string
 *                   last_name:
 *                     type: string
 *                   license_sl_no:
 *                     type: string
 *                   license_type:
 *                     type: string
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get("/shortlist/", async (req, res) => {
    try {
        const contractors = await Contractor.find({}, { first_name: 1, last_name: 1, license_sl_no: 1, license_type: 1 });
        res.json(contractors);
    } catch (error) {
        console.error("Error fetching shortlist:", error);
        res.status(500).json({ error: "Internal server error" });
    }
})

/**
 * @swagger
 * /api/v2/contractors/page/{page}:
 *   get:
 *     summary: Get contractors with pagination
 *     tags: [Contractors]
 *     description: Retrieve contractors with pagination (30 items per page)
 *     parameters:
 *       - in: path
 *         name: page
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number (starts at 1)
 *     responses:
 *       200:
 *         description: Paginated list of contractors
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Contractor'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
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

/**
 * @swagger
 * /api/v2/contractors/search/{inputedData}:
 *   get:
 *     summary: Search contractors
 *     tags: [Contractors]
 *     description: Search contractors by first name, last name, license number, company name, license type, or license status. Supports pagination.
 *     parameters:
 *       - in: path
 *         name: inputedData
 *         required: true
 *         schema:
 *           type: string
 *         description: Search term (searches across multiple fields)
 *         example: "Smith"
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 30
 *         description: Number of results per page
 *     responses:
 *       200:
 *         description: Search results
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Contractor'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
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

/**
 * @swagger
 * /api/v2/contractors/search/{searchTerm}/page/{page}:
 *   get:
 *     summary: Search contractors with pagination (legacy)
 *     tags: [Contractors]
 *     description: Legacy search endpoint. Search contractors by first name, last name, license number, or company name with pagination.
 *     deprecated: true
 *     parameters:
 *       - in: path
 *         name: searchTerm
 *         required: true
 *         schema:
 *           type: string
 *         description: Search term
 *       - in: path
 *         name: page
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number (starts at 1)
 *     responses:
 *       200:
 *         description: Paginated search results
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Contractor'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
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

/**
 * @swagger
 * /api/v2/contractors/id/{_id}:
 *   get:
 *     summary: Get contractor by ID with jobs
 *     tags: [Contractors]
 *     description: Retrieve a specific contractor by their MongoDB ObjectID with associated jobs and property information
 *     parameters:
 *       - in: path
 *         name: _id
 *         required: true
 *         schema:
 *           type: string
 *         description: Contractor MongoDB ObjectID
 *     responses:
 *       200:
 *         description: Contractor details with jobs and property information
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Contractor'
 *                 - type: object
 *                   properties:
 *                     jobs:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           job_id:
 *                             type: string
 *                           job_number:
 *                             type: string
 *                           property:
 *                             type: object
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get("/id/:_id", async (req, res) => {
    try {
        if (!req.params._id) {
            return res.status(400).json({ error: "Contractor ID is required" });
        }

        const contractor = await Contractor.findById(req.params._id);
        if (!contractor) {
            return res.status(404).json({ error: "Contractor not found" });
        }

        // Fetch jobs using the job_listing array
        const jobs = contractor.job_listing && contractor.job_listing.length > 0
            ? await Jobs.find({ _id: { $in: contractor.job_listing } })
            : [];

        // Fetch property information for each job
        const jobsWithProperty = await Promise.all(
            jobs.map(async (job) => {
                const property = job.propertyID 
                    ? await Property.findById(job.propertyID)
                    : null;
                
                const jobObj = job.toObject();
                jobObj.property = property ? {
                    _id: property._id,
                    house_num: property.house_num,
                    street_name: property.street_name,
                    borough: property.borough,
                    zip: property.zip,
                    building_type: property.building_type,
                    existing_occupancy: property.existing_occupancy
                } : null;
                
                return jobObj;
            })
        );

        const contractorInfo = { ...contractor.toObject() };
        contractorInfo.jobs = jobsWithProperty;

        res.json(contractorInfo);
    } catch (error) {
        console.error("Error fetching contractor by ID:", error);
        res.status(500).json({ error: "Internal server error" });
    }
})

/**
 * @swagger
 * /api/v2/contractors/id/{_id}/full:
 *   get:
 *     summary: Get contractor with all associated jobs
 *     tags: [Contractors]
 *     description: Retrieve a contractor by ID with all jobs where this contractor is listed
 *     parameters:
 *       - in: path
 *         name: _id
 *         required: true
 *         schema:
 *           type: string
 *         description: Contractor MongoDB ObjectID
 *     responses:
 *       200:
 *         description: Contractor details with all associated jobs
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Contractor'
 *                 - type: object
 *                   properties:
 *                     jobs:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Job'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get("/id/:_id/full", async (req, res) => {
    try {
        if (!req.params._id) {
            return res.status(400).json({ error: "Contractor ID is required" });
        }

        const contractor = await Contractor.findById(req.params._id);
        if (!contractor) {
            return res.status(404).json({ error: "Contractor not found" });
        }

        const jobs = await Jobs.find({ contractors: { $in: [req.params._id] } });
        const contractorInfo = { ...contractor.toObject() };
        contractorInfo.jobs = jobs;

        res.json(contractorInfo);
    } catch (error) {
        console.error("Error fetching contractor with jobs:", error);
        res.status(500).json({ error: "Internal server error" });
    }
})

/**
 * @swagger
 * /api/v2/contractors/license/number/{license_number}:
 *   get:
 *     summary: Get contractors by license number
 *     tags: [Contractors]
 *     description: Retrieve all contractors with a specific license number
 *     parameters:
 *       - in: path
 *         name: license_number
 *         required: true
 *         schema:
 *           type: string
 *         description: License number
 *         example: "100001"
 *     responses:
 *       200:
 *         description: List of contractors matching the license number
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Contractor'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get("/license/number/:license_number", async (req, res) => {
    try {
        const contractors = await Contractor.find({ license_number: req.params.license_number });
        res.json(contractors);
    } catch (error) {
        console.error("Error fetching contractors by license number:", error);
        res.status(500).json({ error: "Internal server error" });
    }
})

/**
 * @swagger
 * /api/v2/contractors/license/status/{status}:
 *   get:
 *     summary: Get contractors by license status
 *     tags: [Contractors]
 *     description: Retrieve all contractors with a specific license status
 *     parameters:
 *       - in: path
 *         name: status
 *         required: true
 *         schema:
 *           type: string
 *           enum: [Active, Expired, Ready for Renewal, Surrendered, Failed to Renew, Revoked, Voided, Suspended, Out of Business, Close]
 *         description: License status
 *         example: "Active"
 *     responses:
 *       200:
 *         description: List of contractors with the specified status
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Contractor'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get("/license/status/:status", async (req, res) => {
    try {
        const contractors = await Contractor.find({ license_status: req.params.status });
        res.json(contractors);
    } catch (error) {
        console.error("Error fetching contractors by status:", error);
        res.status(500).json({ error: "Internal server error" });
    }
})

/**
 * @swagger
 * /api/v2/contractors/license/status:
 *   get:
 *     summary: Get all license status values
 *     tags: [Contractors]
 *     description: Retrieve list of all valid license status values in uppercase
 *     responses:
 *       200:
 *         description: List of license statuses
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *               example: ["ACTIVE", "EXPIRED", "READY FOR RENEWAL", "SURRENDERED", "FAILED TO RENEW", "REVOKED", "VOIDED", "SUSPENDED", "OUT OF BUSINESS", "CLOSE"]
 */
router.get("/license/status", async (req, res) => {
    res.json(license_status.map(status => status.toUpperCase()));
})

/**
 * @swagger
 * /api/v2/contractors/license/types:
 *   get:
 *     summary: Get all license type values
 *     tags: [Contractors]
 *     description: Retrieve list of all valid license types in uppercase
 *     responses:
 *       200:
 *         description: List of license types
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *               example: ["CONCRETE SAFETY MANAGER", "CONTRACTOR", "ELECTRICIAN", "PLUMBER"]
 */
router.get("/license/types", async (req, res) => {   
    res.json(licenseTypes.map(type => type.toUpperCase()));
})

/**
 * @swagger
 * /api/v2/contractors/newNumber:
 *   get:
 *     summary: Generate new contractor license number
 *     tags: [Contractors]
 *     description: Generate a new unique contractor license number by finding the highest existing license number and incrementing it. Starts at 100001 if no licenses exist.
 *     responses:
 *       200:
 *         description: New license number generated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 new_contractor_number:
 *                   type: string
 *                   description: The newly generated license number
 *                   example: "100002"
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get("/newNumber", async (req, res) => {

    // generate a new contractor license number by scanning
    // existing licenses, finding the highest numeric value,
    // and incrementing it.

    try {
        const contractors = await Contractor.find({ license_number: { $ne: null } }).select("license_number");

        let maxLicenseNum = 100000; // starting baseline

        for (const contractor of contractors) {
            if (!contractor.license_number) continue;

            // Extract numeric portion (handles possible prefixes)
            const numericPart = contractor.license_number.toString().match(/\d+/);
            if (!numericPart) continue;

            const num = parseInt(numericPart[0], 10);
            if (!isNaN(num) && num > maxLicenseNum) {
                maxLicenseNum = num;
            }
        }

        const newLicenseNumber = maxLicenseNum + 1;
        console.log({ new_contractor_number: newLicenseNumber.toString() });
        res.json({ new_contractor_number: newLicenseNumber.toString() });
    } catch (error) {
        console.error("Error generating new contractor license number:", error);
        res.status(500).json({ error: "Internal server error" });
    }


});

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