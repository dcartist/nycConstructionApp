const mongoose = require('../db/connection')

const Property = new mongoose.Schema({
    borough: {
        type: String,
        default: String,
        uppercase: true,
        trim: true
    },
    city: {
        type: String,
        default: String,
        trim: true
    },
    street_name: {
        type: String,
        default: String,
        trim: true
    },
    propNum: {
        type: String,
        default: String,
        trim: true
    },
    propType: {
        type: String,
        default: String,
        trim: true
    },
    jobDescr: {
        type: String,
        default: String,
        lowercase: true,
        trim: true
    },
    address: {
        type: String,
        default: String,
        trim: true
    },
    contractor: {
        ref: "Contractor",
        type: mongoose.Schema.Types.ObjectId
    },
    owner: {
        ref: "Owner",
        type: mongoose.Schema.Types.ObjectId
    },
    conLicense: {
        type: String,
        default: 0
            // trim: true
    },
    jobId: Number,
})


let property = mongoose.model('Property', Property)
module.exports = property