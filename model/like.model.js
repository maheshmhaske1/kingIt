const mongoose = require('mongoose')

const likeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId
    },
    postId: {
        type: mongoose.Types.ObjectId
    }
})


var likeModel = mongoose.model('likes', likeSchema);
module.exports = likeModel;