const mongoose = require('mongoose');

const ownerSchemaV2 = new mongoose.Schema({
  user_id: {
    type: Number,
    required: true
  },
  user_firstName: {
    type: Number,
    required: true
  },
  user_LastName: {
    type: Number,
    required: true
  },
  userRoleID: {
    type: Number,
    required: true
  }
});

const OwnerV2 = mongoose.model('OwnerV2', ownerSchemaV2);

module.exports = OwnerV2;