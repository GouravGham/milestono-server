const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const propertySchema = new Schema({
  sellType: { type: String },
  propertyCategory: { type: String },
  oldProperty: { type: String },
  propertyContains: { type: [String] },
  amenities: { type: [String] },
  furnitures: { type: [String] },
  email: { type: String },
  phnumber: { type: String },
  city: { type: String },
  bedrooms: { type: String },
  bathrooms: { type: String },
  balconies: { type: String },
  ownership: { type: String },
  expectedPrice: { type: String },
  pricePerSqFt: { type: String },
  isAllInclusive: { type: Boolean, default: false },
  isPriceNegotiable: { type: Boolean, default: false },
  isTaxchargeExc: { type: Boolean, default: false },
  uniqueFeatures: { type: String },
  areaSqft: { type: String },
  uploadedPhotos: { type: [String] }
});

const Property = mongoose.model('Property', propertySchema);

module.exports = Property;
