
const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
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
    applicant_Title: {
        type: String,
        default: String,
        trim: true
    },
    applicant_License: {
        type: String,
        default: String,
        trim: true
    },
    });

module.exports = mongoose.model('Application', applicationSchema);

 