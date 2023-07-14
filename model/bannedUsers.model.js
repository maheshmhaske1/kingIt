const mongoose = require("mongoose");

const banneduserSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
    },
    period: {
        type: Date
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
    },

    isPermenentBan: {
        type: Boolean,
        default:false
    },
},
    {
        timestamps: true,
    }
);

var bannedUserModel = mongoose.model("bannedUsers", banneduserSchema);
module.exports = bannedUserModel;
