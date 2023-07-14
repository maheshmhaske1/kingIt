const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  image: {
    type: String,
  },
  whatsapp: {
    type: String,
  },
  link: {
    type: String
  },
  createdBy: {
    type: mongoose.Types.ObjectId,
  },
});


const Banner = mongoose.model('Banner', bannerSchema);

module.exports = Banner;
