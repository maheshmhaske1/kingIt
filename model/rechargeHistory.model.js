const mongoose = require("mongoose");

const rechargeHistorySchema = new mongoose.Schema({
  usrId: {
    type: mongoose.Types.ObjectId,
  },
  coinAdded: {
    type: Number,
  },
});

var rechargeHistoryModel = mongoose.model(
  "rechargeHistorys",
  rechargeHistorySchema
);
module.exports = rechargeHistoryModel;
