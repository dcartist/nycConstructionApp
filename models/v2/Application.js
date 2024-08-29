const mongoose = require('../../db/connection')

const applicationSchemaV2 = new mongoose.Schema({
    applicant_firstName: {
        type: String,
        default: String,
        trim: true
    },
    applicant_lastName: {
        type: String,
        default: String,
        trim: true
    },
    applicant_title: {
        type: String,
        default: String,
        trim: true
    },
    applicant_license: {
        type: String,
        default: String,
        trim: true
    },
    job_listing:
    {
        type: [String],
        default: [],
    },

    }, {timeseries: true});

module.exports = mongoose.model('ApplicationV2', applicationSchemaV2);

 