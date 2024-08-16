const mongoose = require('mongoose');

const ownerSchema = new mongoose.Schema({
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

const Owner = mongoose.model('Owner', ownerSchema);

module.exports = Owner;