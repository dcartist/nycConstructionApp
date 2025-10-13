const express = require("express");
const router = express.Router();
const OwnerV2 = require("../../models/v2/Owner.js");

router.get("/", async (req, res) => {
    try {
        const owners = await OwnerV2.find().populate('propertyID');
        res.json(owners);
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve owners.", details: error.message });
    }
});

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
