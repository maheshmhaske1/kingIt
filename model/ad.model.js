const mongoose = require("mongoose");

const adSchema = new mongoose.Schema({
  url: {
    type: String,
    default: "",
  },
  status: {
    type: Number,
    default: 1,
  },
  createdBy:{
    type:mongoose.Types.ObjectId
  }
},
{
  timestamps: true,
});

var adModel = mongoose.model("ads", adSchema);
module.exports = adModel;
