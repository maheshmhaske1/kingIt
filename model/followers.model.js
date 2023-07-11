const mongoose = require('mongoose')

const FollowersSchema = new mongoose.Schema(
    {
        following_from: {
            type: mongoose.Types.ObjectId,
            ref: "users"
        },
        following_to: {
            type: mongoose.Types.ObjectId,
            ref: "users"
        }
    },
    {
        timestamps: true,
    }
);

const Followers_Model = mongoose.model('user_followers', FollowersSchema)
module.exports = Followers_Model