const mongoose = require('../../db/connection');
require('./Owner.js'); 

const propertySchemaV2 = new mongoose.Schema({
    house_num: {
        type: String,
        trim: true
    },
    street_name: {
        type: String,
        trim: true
    },
    landmarked: {
        type: String,
        trim: true
    },
    property_owner_firstName: {
        type: String,
        trim: true
    },
    property_owner_lastName: {
        type: String,
        trim: true
    },
    building_type: {
        type: String,
        trim: true
    },
    existing_occupancy: {
        type: String,
        trim: true
    },
    owner_type: {
        type: String,
        trim: true
    },
    property_owner_business_name: {
        type: String,
        trim: true
    },
    non_profit: {
        type: String,
        trim: true
    },
    proptertyID: {
        type: Number,
        default: 0
    },
    building_type: {
        type: String,
        trim: true
    },
    borough: {
        type: String,
        trim: true
    },
    community___board: {
        type: Number,
        default: 0
    },
    ownerID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OwnerV2', 
        index: true
    },
 

});

module.exports = mongoose.model('PropertyV2', propertySchemaV2);



