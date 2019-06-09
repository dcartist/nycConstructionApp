const mongoose = require('../db/connection')
const Schema = mongoose.Schema;

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
    property: [{
        ref: "Property",
        type: Schema.Types.ObjectId
    }],
    owner: [{
        ref: "Owner",
        type: Schema.Types.ObjectId
    }],
    jobId: Number,
})

let contractor = mongoose.model('Contractor', Contractor)
module.exports = contractor

/* “conFirstName"
"conLastName"
"conLicense"  */