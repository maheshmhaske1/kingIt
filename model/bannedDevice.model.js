const mongoose = require("mongoose");

const bannedDeviceSchema = new mongoose.Schema({
  bannedDevice: {
    type: String,
    default: "",
  },
},
{
  timestamps: true,
});

var bannedDeviceModel = mongoose.model("bannedDevise", bannedDeviceSchema);
module.exports = bannedDeviceModel;
