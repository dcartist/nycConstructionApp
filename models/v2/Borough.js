const mongoose = require('../db/connection')

const bouroughSchemaV2 = new mongoose.Schema({
  brough_Name: {
    type: String,
    default: String,
    trim: true
  },
    brough_Number: {
        type: Number,
        default: 0
    },
});


module.exports = mongoose.model('BouroughV2', bouroughSchemaV2);