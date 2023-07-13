const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  image: {
    type: String,
  },
  coin: {
    type: Number,
  },
  status: {
    type: String
  },

  createdBy: {
    type: mongoose.Types.ObjectId,
  },
});


const Banner = mongoose.model('Banner', bannerSchema);

module.exports = Banner;
