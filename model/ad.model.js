const mongoose = require("mongoose");

const adSchema = new mongoose.Schema({
  url: {
    type: String,
    default: "",
  },
  status: {
    type: Number,
    default: 1,
  }
});

var adModel = mongoose.model("ads", adSchema);
module.exports = adModel;
