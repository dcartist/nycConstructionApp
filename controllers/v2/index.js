const express = require("express");
const router = express.Router();
const jobsController = require("./jobs.js");


router.get("/", (req, res) => {
   res.send("Welcome to the API v2");
})

router.use("/jobs", jobsController);

module.exports = router