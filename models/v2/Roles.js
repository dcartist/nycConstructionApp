const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  roleName: {
    type: String,
    required: true
  },
  roleID: {
    type: Number,
    required: true,
    unique: true
  }
});

const Role = mongoose.model('RoleV2', roleSchemaV2);
module.exports = Role;