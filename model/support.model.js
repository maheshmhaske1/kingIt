const mongoose = require('mongoose')

const userSupportSchema = new mongoose.Schema({
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
    message: {
        type: String,
        default: ''
    }
})


var userSupportModel = mongoose.model('userSupports', userSupportSchema);
module.exports = userSupportModel;