const mongoose = require("mongoose");

const liveJoinedSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
  },
  liveId: {
    type: mongoose.Types.ObjectId,
  },
  isAdmin: {
    type: Boolean,
    default: false
  }
},
{
  timestamps: true,
});

var liveJoinedModel = mongoose.model("live_joined", liveJoinedSchema);
module.exports = liveJoinedModel;
