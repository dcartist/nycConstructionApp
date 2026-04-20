const express = require("express");
const router = express.Router();
const Property = require('../../models/v2/Property.js')
const Contractor = require('../../models/v2/Contractor.js')
const Jobs = require('../../models/v2/Jobs.js')
const Application = require('../../models/v2/Application.js')

/**
 * @swagger
 * /api/v2/properties:
 *   get:
 *     summary: Get all properties
 *     tags: [Properties]
 *     description: Retrieve all properties from the database
 *     responses:
 *       200:
 *         description: List of all properties
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Property'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get("/", (req, res) => {
    Property.find().then(properties => {
        res.json(properties)
    })
})

/**
 * @swagger
 * /api/v2/properties/search/{inputedData}:
 *   get:
 *     summary: Search properties
 *     tags: [Properties]
 *     description: Search properties by street name, borough, or house number. Supports pagination.
 *     parameters:
 *       - in: path
 *         name: inputedData
 *         required: true
 *         schema:
 *           type: string
 *         description: Search term (searches street_name, borough, house_num)
 *         example: "Broadway"
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
 *                 $ref: '#/components/schemas/Property'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
// Property search endpoint - returns only property documents.
// Usage:
//   GET /v2/property/search/:inputedData
//   GET /v2/property/search/:inputedData?page=1&limit=30
router.get("/search/:inputedData", async (req, res) => {
    const q = req.params.inputedData || req.query.q;
    const page = !req.query.page || isNaN(req.query.page) ? 1 : parseInt(req.query.page);
    const limit = !req.query.limit || isNaN(req.query.limit) ? 30 : parseInt(req.query.limit);

    if (!q || typeof q !== "string") {
        return res.status(400).json({ error: "Query parameter 'q' is required" });
    }

    try {
        const searchRegex = new RegExp(q, "i");

        const properties = await Property.find({
            $or: [
                { street_name: searchRegex },
                { borough: searchRegex },
                { house_num: searchRegex }
            ]
        })
            .skip((page - 1) * limit)
            .limit(limit);

        res.json(properties);
    } catch (error) {
        console.error("Error searching properties:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


// router.get("/search/:searchTerm/", (req, res) => {
//     let searchTerm = req.params.searchTerm
//     const searchRegex = new RegExp(searchTerm, 'i');

//     Property.find({
//         $or: [
//             { street_name: searchRegex }, 
//             { borough: searchRegex },
//             { house_num: searchRegex },
//             { zip_code: searchRegex }
//         ]
//     })
//         .then(properties => {
//             res.json(properties)
//         })
// })

/**
 * @swagger
 * /api/v2/properties/id/{propertyID}:
 *   get:
 *     summary: Get property by ID with jobs
 *     tags: [Properties]
 *     description: Retrieve a specific property by its MongoDB ObjectID with all associated jobs
 *     parameters:
 *       - in: path
 *         name: propertyID
 *         required: true
 *         schema:
 *           type: string
 *         description: Property MongoDB ObjectID
 *     responses:
 *       200:
 *         description: Property details with associated jobs
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Property'
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

/**
 * @swagger
 * /api/v2/properties/borough/{borough}:
 *   get:
 *     summary: Get properties by borough
 *     tags: [Properties]
 *     description: Retrieve all properties in a specific borough
 *     parameters:
 *       - in: path
 *         name: borough
 *         required: true
 *         schema:
 *           type: string
 *           enum: [MANHATTAN, BROOKLYN, QUEENS, BRONX, STATEN ISLAND]
 *         description: Borough name
 *         example: "MANHATTAN"
 *     responses:
 *       200:
 *         description: List of properties in the specified borough
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Property'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get("/borough/:borough", (req, res) => {
    Property.find({ borough: req.params.borough }).then(jobs => {
        res.json(jobs)
    })
})

/**
 * @swagger
 * /api/v2/properties/street/{street_name}:
 *   get:
 *     summary: Get properties by street name
 *     tags: [Properties]
 *     description: Retrieve all properties on a specific street
 *     parameters:
 *       - in: path
 *         name: street_name
 *         required: true
 *         schema:
 *           type: string
 *         description: Street name
 *         example: "BROADWAY"
 *     responses:
 *       200:
 *         description: List of properties on the specified street
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Property'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get("/street/:street_name", (req, res) => {
    Property.find({ street_name: req.params.street_name }).then(jobs => {
        res.json(jobs)
    })
})

/**
 * @swagger
 * /api/v2/properties/house/{house_num}:
 *   get:
 *     summary: Get properties by house number
 *     tags: [Properties]
 *     description: Retrieve all properties with a specific house number
 *     parameters:
 *       - in: path
 *         name: house_num
 *         required: true
 *         schema:
 *           type: string
 *         description: House number
 *         example: "123"
 *     responses:
 *       200:
 *         description: List of properties with the specified house number
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Property'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
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