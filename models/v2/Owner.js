const mongoose = require('mongoose');
require('./Property.js');

const ownerSchemaV2 = new mongoose.Schema({

  owner_id: { type: Number, unique: true, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phone: { type: String },
  businessName: { type: String },
  propertyID: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PropertyV2',
  }],
}, { minimize: false });

ownerSchemaV2.path('propertyID').default(() => []);

module.exports = mongoose.model('OwnerV2', ownerSchemaV2);