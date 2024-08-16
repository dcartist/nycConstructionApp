const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    JobStartDate: {
        type: Date,
        default: Date.now
    },
    jobEndDate: {
        type: Date,
        default: Date.now
    },
    jobEstEndDate: {
        type: Date,
        default: Date.now
    },
    job_status: {
        type: String,
        default: String,
        trim: true
    },
    job_type: {
        type: String,
        default: String,
        trim: true
    },
    other_Description: {
        type: String,
        default: String,
        trim: true
    },
    propertyID: {
        type: Number,
        default: 0
    },
    Application_id: {
        type: Number,
        default: 0
    },
    Property_proptertyID: {
        type: Number,
        default: 0
    },
    approved_date: {
        type: Date,
        default: Date.now
    },
    approved: {
        type: Boolean,
        default: false
    },
    initial_cost: {
        type: Number,
        default: 0
    },
    total_est__fee: {
        type: Number,
        default: 0
    },
    job_status_descrp: {
        type: String,
        default: String,
        trim: true
    },
});

module.exports = mongoose.model('Job', jobSchema);