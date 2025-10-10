const mongoose = require('mongoose');

const ownerSchemaV2 = new mongoose.Schema({
  owner_id: {
    type: Number,
    required: true
  },
firstName: {
    type: Number,
    required: true
  },
  lastName: {
    type: Number,
    required: true
  }
});

const OwnerV2 = mongoose.model('OwnerV2', ownerSchemaV2);

module.exports = OwnerV2;