const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId
    },
    caption: {
        type: String,
        default: ''
    },
    postUrl: {
        type: String,
        default: ''
    }
},
    {
        timestamps: true
    })


var postModel = mongoose.model('posts', postSchema);
module.exports = postModel;