const express = require("express");
const router = express.Router();
const jobsController = require("./jobs.js");
const applicationsController = require("./applications.js");
const propertyController = require("./property.js");
const contractorsController = require("./contractors.js");
const seedData = require("../../db/v2/seed.js");

router.post("/seed", async (req, res) => {
  try {
    await seedData();
    res.json({ message: "Seeding completed successfully." });
  } catch (error) {
    res.status(500).json({ error: "Seeding failed.", details: error.message });
  }
});

router.get("/", (req, res) => {
   res.send("Welcome to the API v2");
})



router.use("/jobs", jobsController);
router.use("/applications", applicationsController);
router.use("/properties", propertyController);
router.use("/contractors", contractorsController);

module.exports = router