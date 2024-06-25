// models/Account.js
const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
  packageName: { type: String},
  numOfViewers: { type: Number},
  numOfContactDetails: { type: Number},
  numOfProperties: { type: Number},
  canContactAdmin: { type: Boolean},
  validity: { type: Number},
  price: { type: Number}
});

const Account = mongoose.model('Account', accountSchema);

module.exports = Account;
