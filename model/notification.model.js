const mongoose = require('mongoose')

const notificationSchema = new mongoose.Schema({
    to: {
        type: mongoose.Types.ObjectId,
        default: ''
    },
    from: {
        type: mongoose.Types.ObjectId,
        default: ''
    },
    title: {
        type: String,
        default: ''
    },
    body: {
        type: String,
        default: ''
    },
    isRead: {
        type: Boolean,
        default: false
    }
},
{
    timestamps: true,
})


var notificationModel = mongoose.model('notifications', notificationSchema);
module.exports = notificationModel;