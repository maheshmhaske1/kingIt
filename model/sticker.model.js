const mongoose = require("mongoose");

const stickerSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  url: {
    type: String,
  },
  status: {
    type: Number
  },
  createdBy: {
    type: mongoose.Types.ObjectId
  }
},
{
  timestamps: true,
});

var stickerModel = mongoose.model(
  "stickers",
  stickerSchema
);
module.exports = stickerModel;
