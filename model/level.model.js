const mongoose = require("mongoose");

const levelSchema = new mongoose.Schema({
  levelName: {
    type: String,
  },
  requirement: {
    type: String,
  },
});

var levelModel = mongoose.model("levels", levelSchema);
module.exports = levelModel;
