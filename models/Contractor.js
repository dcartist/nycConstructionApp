const mongoose = require('../db/connection')
const Contractor = new mongoose.Schema({
    conFirstName: {
        type: String,
        default: String,
        trim: true
    },
    conLastName: {
        type: String,
        default: String,
        uppercase: true,
        trim: true
    },
    conLicense: {
        type: String,
        default: 0
            // trim: true
    },
    propertyInfo: {
        ref: "Property",
        type: mongoose.Schema.Types.ObjectId
    },
    ownerInfo: {
        ref: "Owner",
        type: mongoose.Schema.Types.ObjectId
    },
})

let contractor = mongoose.model('Contractor', Contractor)
module.exports = contractor

/* “conFirstName"
"conLastName"
"conLicense"  */