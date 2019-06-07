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
    contractorInfo: {
        ref: "Contractor",
        type: mongoose.Schema.Types.ObjectId
    },
    ownerInfo: {
        ref: "Owner",
        type: mongoose.Schema.Types.ObjectId
    },
})

let property = mongoose.model('Property', Property)
module.exports = property

/* "borough"
"address"
"city"
"zip"
"propType"
 “jobDescr” 
 */