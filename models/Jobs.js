const mongoose = require('../db/connection')

const Jobs = new mongoose.Schema({
    jobId: Number,
    contractor: {
        ref: "Contractor",
        type: mongoose.Schema.Types.ObjectId
    },
    owner: {
        ref: "Owner",
        type: mongoose.Schema.Types.ObjectId
    },
    property: {
        ref: "Property",
        type: mongoose.Schema.Types.ObjectId
    },
})

let jobs = mongoose.model('JobsFull', Jobs)
module.exports = jobs