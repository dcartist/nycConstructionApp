const mongoose = require('mongoose');


const propertySchema = new mongoose.Schema({
    house_Num: {
        type: String,
        default: String,
        trim: true
    },
    street_Name: {
        type: String,
        default: String,
        trim: true
    },
    proptertyID: {
        type: Number,
        default: 0
    },
    building_type: {
        type: String,
        default: String,
        trim: true
    },
    community___board: {
        type: Number,
        default: 0
    },
    bourough: {
        type: String,
        default: String,
        trim: true
    },
    Borough_id: {
        type: Number,
        default: 0
    },
    Borough_borough_id: {
        type: Number,
        default: 0
    },
});

module.exports = mongoose.model('Property', propertySchema);



