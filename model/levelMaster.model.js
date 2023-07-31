const mongoose = require("mongoose");

const levelMasterSchema = new mongoose.Schema({
    levelImgUrl: {
        type: String,
    },
    coinRequire: {
        type: String,
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
      },
},
{
    timestamps: true,
});

var levelMasterModel = mongoose.model("levelMaster", levelMasterSchema);
module.exports = levelMasterModel;
