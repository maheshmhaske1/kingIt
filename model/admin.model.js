const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    default: "",
  },
  password: {
    type: String,
    default: 0,
  },
  token: {
    type: String,
  },
  Permissions:{
    type:String
  }
});

var adminModel = mongoose.model("admin", adminSchema);
module.exports = adminModel;
