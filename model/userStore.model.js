const mongoose = require("mongoose");

const userStoreSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
  },
  storeId: {
    type: mongoose.Types.ObjectId,
  },
  inUse: {
    type: Boolean,
    default: false,
  },
  validTill: {
    type: Date,
  },
  
  createdBy: {
    type: mongoose.Types.ObjectId,
  },
});

var userStoreModel = mongoose.model("userStoreItems", userStoreSchema);
module.exports = userStoreModel;
