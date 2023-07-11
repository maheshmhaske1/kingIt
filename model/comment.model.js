const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
  },
  postId: {
    type: mongoose.Types.ObjectId,
  },
  comment: {
    type: String,
    default: "",
  },
});

var commentModel = mongoose.model("comments", commentSchema);
module.exports = commentModel;
