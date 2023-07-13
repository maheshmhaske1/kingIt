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
});

var levelMasterModel = mongoose.model("levelMaster", levelMasterSchema);
module.exports = levelMasterModel;
