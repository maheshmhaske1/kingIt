const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: "",
  },
  email: {
    type: String,
    default: "",
  },
  country: {
    type: String,
  },
  photo: {
    type: String,
  },
  about: {
    type: String,
  },
  dob: {
    type: Date,
  },
  mobile: {
    type: Number,
    default: "",
  },
  gender: {
    type: Number,
  },
  coin: {
    type: Number,
    default: 0,
  },
  LiveEarningcoin: {
    type: Number,
    default: 0,
  },
  isBlocked: {
    type: Boolean,
    default: false,
  },
  kickedUser: {
    type: [mongoose.Types.ObjectId]
  },
  id: { type: String },
  firebase_id: { type: String },
  deviceId: { type: String },
  token: {
    type: String,
  },
});

var userModel = mongoose.model("users", userSchema);
module.exports = userModel;
