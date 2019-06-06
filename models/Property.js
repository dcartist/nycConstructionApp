const mongoose = require('../db/connection')
const Property = new mongoose.Schema({
    borough: {
        type: String,
        default: String,
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
        trim: true
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