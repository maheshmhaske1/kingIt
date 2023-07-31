const mongoose = require("mongoose");

const requestedUsersLivechema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
  },
  liveId: {
    type: String,
  },
  status: {
    type: Number,
    default: 0, //0.pending 1.accepted 2.rejected
  },
},
{
  timestamps: true,
});

var requestedUsersLiveModel = mongoose.model(
  "requestedUsersLive",
  requestedUsersLivechema
);
module.exports = requestedUsersLiveModel;
