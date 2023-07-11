const mongoose = require("mongoose");

const bannedDeviceSchema = new mongoose.Schema({
  bannedDevice: {
    type: String,
    default: "",
  },
});

var bannedDeviceModel = mongoose.model("bannedDevise", bannedDeviceSchema);
module.exports = bannedDeviceModel;
