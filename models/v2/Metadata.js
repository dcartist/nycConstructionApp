const mongoose = require('../../db/connection')
const MetadataSchema = new mongoose.Schema({
    JobTotal: {
        type: Number,
        default: 0
    },
    OwnerTotal: {
        type: Number,
        default: 0
    },
    PropertyTotal: {
        type: Number,
        default: 0
    },
    ContractorTotal: {
        type: Number,
        default: 0
    },
    ApplicationTotal: {
        type: Number,
        default: 0
    }

})
module.exports = mongoose.model('Metadata', MetadataSchema)
