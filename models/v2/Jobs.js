const mongoose = require('../../db/connection')

const jobSchemaV2 = new mongoose.Schema({
    job_number: {
        type: String,
        default: String,
        trim: true
    },
    prefiling_date: {
        type: Date,
        default: null
    },
    paid: {
        type: Date,
        default: null
    },
    latest_action_date: {
        type: Date,
        default: null
    },
    fully_permitted: {
        type: Date,
        default: null
    },
    job_description: {
        type: String,
        trim: true
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
    other_description: {
        type: String,
        trim: true
    },
    propertyID: {
        type: String,
        default: '',
        trim: true
    },
    application_num: {
        type: String,
        default: String,
        trim: true
    },
    application_id: {
        type: String,
        default: String,
        trim: true
    },
    contractors: 
    {
        type: [String],
        default: [],
    },
    Property_proptertyID: {
        type: String,
        default: '',
        trim: true
    },
    approved_date: {
        type: mongoose.Schema.Types.Mixed,
    required: false,
    validate: {
      validator: function(value) {
        return typeof value === 'string' || value instanceof Date;
      },
      message: props => `${props.value} is not a valid type.`
    }

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
    professional_cert: {
        type: String,
        trim: true
    },
    job_status_descrp: {
        type: String,
        default: String,
        trim: true
    },
}, { timestamps: true });

module.exports = mongoose.model('JobV2', jobSchemaV2);