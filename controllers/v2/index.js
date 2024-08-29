const express = require("express");
const router = express.Router();
const jobsController = require("./jobs.js");
const applicationsController = require("./applications.js");

router.get("/", (req, res) => {
   res.send("Welcome to the API v2");
})

router.use("/jobs", jobsController);
router.use("/applications", applicationsController);

module.exports = router