const mongoose = require('../../db/connection');
const Jobs = require('./Jobs');

const contractorSchemaV2 = new mongoose.Schema({
    license_sl_no: {
        type: String,
        trim: true
      },
      license_type: {
        type: String,
        trim: true
      },
      license_number: {
        type: String,
        trim: true
      },
      last_name: {
        type: String,
        trim: true
      },
      first_name: {
        type: String,
        trim: true
      },
      business_name: {
        type: String,
        trim: true
      },
      business_house_number: {
        type: String, 
        trim: true
      },
      business_street_name: {
        type: String,
        trim: true
      },
      license_business_city: {
        type: String,
        trim: true
      },
      business_state: {
        type: String,
        trim: true
      },
      business_zip_code: {
        type: String,
        trim: true
      },
      business_phone_number: {
        type: String,
        trim: true
      },
      license_status: {
        type: String,
        required: true
      },
      job_listing: { type: [String],
        default: [],}

}, {timeseries: true});


module.exports = mongoose.model('ContractorV2', contractorSchemaV2);