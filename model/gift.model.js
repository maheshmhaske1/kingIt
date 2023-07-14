const mongoose = require('mongoose');

const giftSchema = new mongoose.Schema({
  category: {
    type: String
  },
  name: {
    type: String,
  },
  vat: {
    type: String,
  },
  coin: {
    type: Number,
  },
  image: {
    type: String,
  },
  createdBy: {
    type: mongoose.Types.ObjectId,
  },
});

const Gift = mongoose.model('Gifts', giftSchema);

module.exports = Gift;
