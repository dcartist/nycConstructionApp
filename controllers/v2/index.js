const express = require("express");
const router = express.Router();
const jobsController = require("./jobs.js");
const applicationsController = require("./applications.js");
const propertyController = require("./property.js");
const contractorsController = require("./contractors.js");
const Metadata = require("../../models/v2/Metadata.js");
const ownerController = require("./owners.js");
// const seedData = require("../../db/v2/seed.js");

// router.post("/seed", async (req, res) => {
//   try {
//     await seedData();
//     res.json({ message: "Seeding completed successfully." });
//   } catch (error) {
//     res.status(500).json({ error: "Seeding failed.", details: error.message });
//   }
// });

router.get("/", (req, res) => {
   res.send("Welcome to the API v2");
})

router.get("/status", (req, res) => {
   res.json({ status: "API v2 is running", timestamp: new Date() });
})
router.get("/meta", async (req, res) => {
// go through all the collections and get the counts then insert into metadata collection
  try {
    const jobCount = await require("../../models/v2/Jobs.js").countDocuments();
    const ownerCount = await require("../../models/v2/Owner.js").countDocuments();
    const propertyCount = await require("../../models/v2/Property.js").countDocuments();
    const contractorCount = await require("../../models/v2/Contractor.js").countDocuments();
    const applicationCount = await require("../../models/v2/Application.js").countDocuments();

    let metadata = await Metadata.findOne();
    if (!metadata) {
      metadata = new Metadata();
    }

    metadata.JobTotal = jobCount;
    metadata.OwnerTotal = ownerCount;
    metadata.PropertyTotal = propertyCount;
    metadata.ContractorTotal = contractorCount;
    metadata.ApplicationTotal = applicationCount;

    await metadata.save();
    res.json(metadata);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve metadata.", details: error.message });
  }

});

router.use("/owners", ownerController);
router.use("/jobs", jobsController);
// Expose applications under both /applications and /applicants
router.use("/applications", applicationsController);
router.use("/properties", propertyController);
router.use("/contractors", contractorsController);

module.exports = router