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
        trim: true
    },
    conLicense: {
        type: String,
        default: String,
        trim: true
    },
})

let contractor = mongoose.model('Contractor', Contractor)
module.exports = contractor

/* “conFirstName"
"conLastName"
"conLicense"  */