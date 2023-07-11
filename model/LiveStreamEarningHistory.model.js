const mongoose = require("mongoose");

const liveEarningHostorySchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Types.ObjectId,
  },
  receiverId: {
    type: mongoose.Types.ObjectId,
  },
  liveId: {
    type: mongoose.Types.ObjectId,
  },
  coin: { type: Number },
});

var liveearningModel = mongoose.model(
  "liveEarningHistorys",
  liveEarningHostorySchema
);
module.exports = liveearningModel;
