const mongoose = require("mongoose");

const liveSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
  },
  liveUniqueId: {
    type: String,
  },
  channelName: {
    type: String,
  },
  blockedUsers: {
    type: [mongoose.Types.ObjectId],
  },
  coin: {
    type: Number,
    default: 0,
  },
  mutedUser: {
    type: [mongoose.Types.ObjectId]
  },
  isEnded: {
    type: Boolean,
    default: false,
  },
});

var liveModel = mongoose.model("lives", liveSchema);
module.exports = liveModel;
