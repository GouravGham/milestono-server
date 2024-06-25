const mongoose = require('mongoose');

const servicemanSchema = new mongoose.Schema({
  vendorImage: String,
  email: String,
  adharImage: String,
  panImage: String,
  certificateImage: String,
  serviceRoll: String,
  vendorDescription: String,
  experience: String,
  district: String,
  state: String,
  subDistrict: String,
  address: String,
  status:String,
});

module.exports = mongoose.model('Serviceman', servicemanSchema);
