const mongoose = require('mongoose')

const feedbackSchema = new mongoose.Schema({
    usrId: {
        type: mongoose.Types.ObjectId
    },
    name: {
        type: String,
        default: ''
    },
    email: {
        type: String,
        default: ''
    },
    mobile: {
        type: String,
        default: ''
    },
    feedbackMessage: {
        type: String,
        default: ''
    }
})


var feedbackModel = mongoose.model('feedbacks', feedbackSchema);
module.exports = feedbackModel;