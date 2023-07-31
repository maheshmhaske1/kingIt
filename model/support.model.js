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
},
{
    timestamps: true,
})


var userSupportModel = mongoose.model('userSupports', userSupportSchema);
module.exports = userSupportModel;