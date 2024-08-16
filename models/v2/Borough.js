const mongoose = require('../db/connection')

const bouroughSchema = new mongoose.Schema({
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


module.exports = mongoose.model('Bourough', bouroughSchema);