const mongoose = require('mongoose')

const commentsSchema = new mongoose.Schema({
    liveId: {
        type: mongoose.Types.ObjectId
    },
    userId: {
        type: mongoose.Types.ObjectId
    },
    comment: {
        type: String,
        default: ''
    }
})


var commentsModel = mongoose.model('liveComments', commentsSchema);
module.exports = commentsModel;