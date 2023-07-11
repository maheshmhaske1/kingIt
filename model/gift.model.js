const mongoose = require('mongoose');

const giftSchema = new mongoose.Schema({
  category: {
    type: String,
    enum: ['lucky', 'popular', 'luxury', 'customize', 'random'],
  },
  name: {
    type: String,
  },
  coin: {
    type: Number,
  },
  image: {
    type: String,
  },
  thumbnail: {
    type: String,
  },
  sound: {
    type: String,
  }
});

const Gift = mongoose.model('Gift', giftSchema);

module.exports = Gift;
