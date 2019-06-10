const mongoose = require('../db/connection')

const JobsFull = new mongoose.Schema({
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

let jobsFull = mongoose.model('JobsFull', JobsFull)
module.exports = jobsFull