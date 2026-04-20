const express = require("express");
const router = express.Router();
const OwnerV2 = require("../../models/v2/Owner.js");

/**
 * @swagger
 * /api/v2/owners:
 *   get:
 *     summary: Get all owners
 *     tags: [Owners]
 *     description: Retrieve all property owners with populated property information
 *     responses:
 *       200:
 *         description: List of all owners with property details
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Owner'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get("/", async (req, res) => {
    try {
        const owners = await OwnerV2.find().populate('propertyID');
        res.json(owners);
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve owners.", details: error.message });
    }
});

/**
 * @swagger
 * /api/v2/owners/id/{id}:
 *   get:
 *     summary: Get owner by ID
 *     tags: [Owners]
 *     description: Retrieve a specific owner by their MongoDB ObjectID with populated property information
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Owner MongoDB ObjectID
 *     responses:
 *       200:
 *         description: Owner details with property information
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Owner'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get("/id/:id", async (req, res) => {
    try {
        const owner = await OwnerV2.findById(req.params.id).populate('propertyID');
        if (!owner) {
            return res.status(404).json({ error: "Owner not found." });
        }
        res.json(owner);
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve owner.", details: error.message });
    }
});

/**
 * @swagger
 * /api/v2/owners/top:
 *   get:
 *     summary: Get owners sorted by property count
 *     tags: [Owners]
 *     description: Retrieve all owners sorted by number of properties owned (descending order)
 *     responses:
 *       200:
 *         description: List of owners sorted by property count
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Owner'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get("/top", async (req, res) => {
    try {
        const owners = await OwnerV2.find().populate('propertyID');
        owners.sort((a, b) => b.propertyID.length - a.propertyID.length);
        res.json(owners);
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve and sort owners.", details: error.message });
    }
}); 


module.exports = router
