const mongoose = require('../db/connection')
const Owner = new mongoose.Schema({
    ownType: {
        type: String,
        default: String,
        trim: true
    },
    ownFirstName: {
        type: String,
        default: String,
        trim: true
    },
    ownLastName: {
        type: String,
        default: String,
        trim: true
    },
    ownBusinessName: {
        type: String,
        default: String,
        trim: true
    },
    property: {
        ref: "Property",
        type: mongoose.Schema.Types.ObjectId
    },
    contractor: {
        ref: "Contractor",
        type: mongoose.Schema.Types.ObjectId
    },
})

let owner = mongoose.model('Owner', Owner)
module.exports = owner
    /* "ownType"
    "ownFirstName"
    "ownLastName" 
    "ownBusinessName" 
     */