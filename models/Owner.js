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
    properties: {
        ref: "Property",
        type: mongoose.Schema.Types.ObjectId
    },
    contractors: {
        ref: "Contractor",
        type: mongoose.Schema.Types.ObjectId
    },
    jobId: Number,
})

/* For reference: make a new seed type commands that will go through the collection(x) and find a relatable item in collection (y) and match them up and then save
almost like findandUpdate

Property.find({}).then(information => {
    
})

It can't reference something that doesn't exists
You can't find what doesn't exists but you can create it

 */


let owner = mongoose.model('Owner', Owner)
module.exports = owner
    /* "ownType"
    "ownFirstName"
    "ownLastName" 
    "ownBusinessName" 
     */