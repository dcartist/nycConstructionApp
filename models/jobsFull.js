const mongoose = require('../db/connection')

const JobsFull = new mongoose.Schema({
    contractor_id: {
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

    jobId: Number,
})


let jobsFull = mongoose.model('JobsFull', JobsFull)
module.exports = jobsFull

/* "borough"
"address"
"city"
"zip"
"propType"
 “jobDescr” 
 */