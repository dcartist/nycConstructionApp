const mongoose = require('../db/connection')

const Jobsfull = new mongoose.Schema({
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

let jobsfull = mongoose.model('JobsFull', Jobsfull)
module.exports = jobsfull