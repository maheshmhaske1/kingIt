const adminModel = require("../model/admin.model");
const jwtMiddleware = require("../middleware/auth");
const { default: mongoose } = require("mongoose");
const userModel = require("../model/user.model");
const storeModel = require("../model/store.model");
const bannedDeviceModel = require("../model/bannedDevice.model");
const rechargeHistoryModel = require("../model/rechargeHistory.model");
const levelMasterModel = require("../model/levelMaster.model");
const stickerModel = require("../model/sticker.model");
const adModel = require("../model/ad.model");
const { stat } = require("fs-extra");
const Banner = require('../model/banner.model');


exports.addAdmin = async (req, res) => {
  const { Permissions, username, password } = req.body;

  await new adminModel({
    Permissions: Permissions,
    username: username,
    password: password,
  })
    .save()
    .then((success) => {
      return res.json({
        status: true,
        message: "admin added",
        data: success,
      });
    })
    .catch((error) => {
      return res.json({
        status: true,
        message: "something went wrong",
        data: success,
      });
    });
};

exports.adminLogin = async (req, res) => {
  let { username, password } = req.body;

  const isUserFound = await adminModel.findOne({ username: username });
  console.log(isUserFound);
  if (!isUserFound) {
    return res.json({
      success: false,
      message: "user not registered please register",
    });
  }

  if (password === isUserFound.password) {
    const token = await jwtMiddleware.generate_token_admin(
      isUserFound._id,
      isUserFound.username
    );

    console.log(token);
    await adminModel.findOneAndUpdate(
      { _id: mongoose.Types.ObjectId(isUserFound._id) },
      {
        $set: { token: token },
      }
    );

    return res.json({
      success: true,
      message: `logged in`,
      data: isUserFound,
    });
  } else {
    return res.json({
      success: false,
      message: `incorrect password`,
    });
  }
};

exports.getAllUsers = async (req, res) => {
  const isUserFound = await userModel.find();
  if (!isUserFound) {
    return res.json({
      success: false,
      message: "user not found",
    });
  } else {
    return res.json({
      success: true,
      message: "user details",
      data: isUserFound,
    });
  }
};

exports.getUser = async (req, res) => {
  let { userId } = req.params;

  if (!userId) {
    return res.json({
      success: false,
      message: "please provide userId",
    });
  }

  const isUserFound = await userModel.findOne({
    _id: mongoose.Types.ObjectId(userId),
  });
  if (!isUserFound) {
    return res.json({
      success: false,
      message: "user not found",
    });
  } else {
    return res.json({
      success: true,
      message: "user details",
      data: isUserFound,
    });
  }
};

exports.updateUser = async (req, res) => {
  const { userId } = req.params;
  const update_data = req.body;

  if (!userId) {
    return res.json({
      success: false,
      message: "please provide userId",
    });
  }

  await userModel
    .findOneAndUpdate(
      { _id: mongoose.Types.ObjectId(userId) },
      {
        $set: update_data,
      },
      { returnOriginal: false }
    )
    .then((success) => {
      return res.json({
        success: false,
        message: "user details updated",
        success: success,
      });
    })
    .catch((error) => {
      return res.json({
        success: false,
        message: "something went wrong",
      });
    });
};

exports.addItemStore = async (req, res) => {
  const { price, name, validity, status, createdBy } = req.body;

  console.log(req.file);
  if (!req.file)
    return res.json({
      status: false,
      message: `please select image`,
    });

  const displayPhoto = req.file.filename;
  console.log(displayPhoto);
  await new storeModel({
    price: price,
    name: name,
    validity: validity,
    storeUrl: displayPhoto,
    status: status,
    createdBy: createdBy
  })
    .save()
    .then(async (success) => {
      return res.json({
        status: true,
        message: `store added successfully successfully`,
        data: success,
      });
    })
    .catch((error) => {
      return res.json({
        status: false,
        message: `error`,
        error,
      });
    });
};


exports.updateStore = async (req, res) => {
  const { price, name, validity, status, storeId } = req.body;

  if (!storeId) {
    return res.json({
      status: false,
      message: `please provide storeid`,
    })
  }

  const store = await storeModel.findById({ _id: storeId })
  if (!store) {
    return res.json({
      status: false,
      message: `please provide valid storeid`,
    })
  }
  console.log(req.file)
  let displayPhoto;
  if (req.file)
    displayPhoto = req.file.filename;
  console.log(displayPhoto);
  await storeModel.findOneAndUpdate({
    _id: mongoose.Types.ObjectId(storeId)
  },
    {
      $set: {
        price: price,
        name: name,
        validity: validity,
        storeUrl: displayPhoto,
        status: status,
      }
    })
    .then(async (success) => {
      return res.json({
        status: true,
        message: `store updated successfully`,
        data: success,
      });
    })
    .catch((error) => {
      return res.json({
        status: false,
        message: `error`,
        error,
      });
    });
};

exports.getAllStores = async (req, res) => {
  await storeModel
    .aggregate([
      {
        $match: {}
      },
      {
        $lookup: {
          from: "admins",
          foreignField: "_id",
          localField: "createdBy",
          as: "actionBy"
        }
      }
    ])
    .then(async (success) => {
      return res.json({
        status: true,
        message: `All Stores`,
        data: success,
      });
    })
    .catch((error) => {
      return res.json({
        status: false,
        message: `error`,
        error,
      });
    });
};

exports.addDeviceIntoBlock = async (req, res) => {
  const { bannedDevice } = req.body;

  await new bannedDeviceModel({
    bannedDevice: bannedDevice,
  })
    .save()
    .then(async (success) => {
      return res.json({
        status: true,
        message: ` all banned devices`,
        data: success,
      });
    })
    .catch((error) => {
      return res.json({
        status: false,
        message: `error`,
        error,
      });
    });
};

exports.deleteFromBannedDevice = async (req, res) => {
  const { deviceId } = req.body

  await bannedDeviceModel.findOneAndDelete({ bannedDevice: deviceId })
    .then(async (success) => {
      return res.json({
        status: true,
        message: `removed`,
        data: success,
      });
    })
    .catch((error) => {
      return res.json({
        status: false,
        message: `error`,
        error,
      });
    });
}
exports.getAllBannedDevice = async (req, res) => {
  await bannedDeviceModel.find()
    .then(async (success) => {
      return res.json({
        status: true,
        message: `device added into blocklist`,
        data: success,
      });
    })
    .catch((error) => {
      return res.json({
        status: false,
        message: `error`,
        error,
      });
    });
}


exports.recharge = async (req, res) => {
  const { userId, coin, createdBy } = req.body;

  await userModel
    .findOneAndUpdate(
      { _id: mongoose.Types.ObjectId(userId) },
      {
        $set: { coin: coin },
      },
      { returnOriginal: false }
    )
    .then(async (success) => {
      await new rechargeHistoryModel({
        usrId: userId,
        coinAdded: coin,
        createdBy: createdBy
      }).save();
      return res.json({
        status: true,
        message: "coin added",
      });
    })
    .catch((error) => {
      return res.json({
        status: false,
        message: "error",
      });
    });
};

exports.getRechargeHistory = async (req, res) => {
  await rechargeHistoryModel
    .aggregate([
      {
        $lookup: {
          from: "users",
          foreignField: "_id",
          localField: "usrId",
          as: "users",
        },
      },
      {
        $lookup: {
          from: "admins",
          foreignField: "_id",
          localField: "createdBy",
          as: "actionBy"
        }
      }
    ])
    .then((success) => {
      return res.json({
        status: true,
        message: "recharge history",
        data: success,
      });
    })
    .catch((error) => {
      return res.json({
        status: false,
        message: "error",
      });
    });
};

exports.addLevel = async (req, res) => {
  const { price, name, validity, status, createdBy } = req.body;

  console.log(req.file);
  if (!req.file)
    return res.json({
      status: false,
      message: `please select image`,
    });

  const displayPhoto = req.file.filename;
  console.log(displayPhoto);
  await new storeModel({
    price: price,
    name: name,
    validity: validity,
    storeUrl: displayPhoto,
    status: status,
  })
    .save()
    .then(async (success) => {
      return res.json({
        status: true,
        message: `store added successfully successfully`,
        data: success,
      });
    })
    .catch((error) => {
      return res.json({
        status: false,
        message: `error`,
        error,
      });
    });
};

exports.addSticker = async (req, res) => {
  const { title, createdBy } = req.body;

  console.log(req.file);
  if (!req.file)
    return res.json({
      status: false,
      message: `please select image`,
    });

  const displayPhoto = req.file.filename;
  console.log(displayPhoto);
  await new stickerModel({
    title: title,
    url: displayPhoto,
    status: 1,
    createdBy: createdBy
  })
    .save()
    .then(async (success) => {
      return res.json({
        status: true,
        message: `sticker added successfully`,
        data: success,
      });
    })
    .catch((error) => {
      return res.json({
        status: false,
        message: `error`,
        error,
      });
    });
};

exports.getAllSticker = async (req, res) => {
  await stickerModel
    .aggregate([
      {
        $match: {}
      },
      {
        $lookup: {
          from: "admins",
          foreignField: "_id",
          localField: "createdBy",
          as: "actionBy"
        }
      }
    ])
    .then(async (success) => {
      return res.json({
        status: true,
        message: `stickers`,
        data: success,
      });
    })
    .catch((error) => {
      return res.json({
        status: false,
        message: `error`,
        error,
      });
    });
};

exports.updateSticker = async (req, res) => {
  const { stickerId } = req.params;
  const update_data = req.body;

  let displayPhot;
  if (req.file) {
    displayPhoto = req.file.filename;
  }

  await stickerModel
    .findOneAndUpdate(
      { _id: mongoose.Types.ObjectId(stickerId) },
      {
        $set: update_data,
      }
    )
    .then(async (success) => {
      return res.json({
        status: true,
        message: `stickers updated`,
        data: success,
      });
    })
    .catch((error) => {
      return res.json({
        status: false,
        message: `error`,
        error,
      });
    });
};

exports.addLevelMaster = async (req, res) => {
  const { coinRequire, createdBy } = req.body;

  console.log(req.file);
  if (!req.file)
    return res.json({
      status: false,
      message: `please select image`,
    });

  const displayPhoto = req.file.filename;
  await new levelMasterModel({
    coinRequire: coinRequire,
    createdBy: createdBy,
    levelImgUrl: displayPhoto,
  })
    .save()
    .then(async (success) => {
      return res.json({
        status: true,
        message: `level added successfully`,
        data: success,
      });
    })
    .catch((error) => {
      return res.json({
        status: false,
        message: `error`,
        error,
      });
    });
};

exports.updateLevelMaster = async (req, res) => {
  const { coinRequire, createdBy, levelId } = req.body;

  console.log(req.file);
  if (!req.file)
    return res.json({
      status: false,
      message: `please select image`,
    });

  let displayPhoto;
  if (req.file)
    displayPhoto = req.file.filename;
  await levelMasterModel.findByIdAndUpdate({ _id: levelId },
    {
      $set: {
        coinRequire: coinRequire,
        createdBy: createdBy,
        levelImgUrl: displayPhoto,
      }
    }
  )
    .then(async (success) => {
      return res.json({
        status: true,
        message: `level updated successfully`,
        data: success,
      });
    })
    .catch((error) => {
      return res.json({
        status: false,
        message: `error`,
        error,
      });
    });
};

exports.deleteLevelMaster = async (req, res) => {
  const { levelId } = req.body;

  await levelMasterModel
    .findOneAndDelete({ _id: mongoose.Types.ObjectId(levelId) })
    .then(async (success) => {
      return res.json({
        status: true,
        message: `level deleted successfully`,
        data: success,
      });
    })
    .catch((error) => {
      return res.json({
        status: false,
        message: `error`,
        error,
      });
    });
};

exports.getAllLevel = async (req, res) => {
  await levelMasterModel.aggregate([
    {
      $match: {}
    },
    {
      $lookup: {
        from: "admins",
        foreignField: "_id",
        localField: "createdBy",
        as: "actionBy"
      }
    }
  ])
    .then(async (success) => {
      return res.json({
        status: true,
        message: `All levels`,
        data: success,
      });
    })
    .catch((error) => {
      return res.json({
        status: false,
        message: `error`,
        error,
      });
    });
}

exports.addAd = async (req, res) => {
  const { url, createdBy } = req.body;

  await new adModel({
    url: url,
    createdBy: createdBy
  })
    .save()
    .then(async (success) => {
      return res.json({
        status: true,
        message: `ad added successfully`,
        data: success,
      });
    })
    .catch((error) => {
      return res.json({
        status: false,
        message: `error`,
        error,
      });
    });
};

exports.updateAd = async (req, res) => {
  const { AdId, url, status } = req.body;

  await adModel
    .findOneAndUpdate(
      { _id: mongoose.Types.ObjectId(AdId) },
      {
        $set: { url: url, status: status },
      }
    )
    .then(async (success) => {
      return res.json({
        status: true,
        message: `ad updated`,
        data: success,
      });
    })
    .catch((error) => {
      return res.json({
        status: false,
        message: `error`,
        error,
      });
    });
};

exports.getAds = async (req, res) => {
  const { status } = req.params;

  console.log(typeof status);
  await adModel
    .aggregate([
      {
        $match: {}
      },
      {
        $lookup: {
          from: "admins",
          foreignField: "_id",
          localField: "createdBy",
          as: "actionBy"
        }
      }
    ])
    .then(async (success) => {
      return res.json({
        status: true,
        message: `ad details`,
        data: success,
      });
    })
    .catch((error) => {
      return res.json({
        status: false,
        message: `error`,
        error,
      });
    });
};

exports.deleteAd = async (req, res) => {
  const adId = req.params.adId;

  await adModel
    .findByIdAndDelete({ _id: adId })
    .then(async (success) => {
      return res.json({
        status: true,
        message: `ad deleted`,
        data: success,
      });
    })
    .catch((error) => {
      return res.json({
        status: false,
        message: `error`,
        error,
      });
    });
};

exports.getUserByCountry = async (req, res) => {
  const { country } = req.params;

  await userModel
    .find({ country: country })
    .then(async (success) => {
      return res.json({
        status: true,
        message: `user details`,
        data: success,
      });
    })
    .catch((error) => {
      return res.json({
        status: false,
        message: `error`,
        error,
      });
    });
};

const gift = require("../model/gift.model");

// POST /api/gifts
exports.createGift = async (req, res) => {
  const { category, name, coin, createdBy, vat } = req.body;

  if (!req.file)
    return res.json({
      status: false,
      message: `please select image`,
    });

  const displayPhoto = req.file.filename;

  const newGift = new gift({
    category: category,
    name: name,
    coin: coin,
    image: displayPhoto,
    createdBy: createdBy,
    vat: vat
  });

  const createdGift = await newGift.save();

  res.status(201).json({ message: "Created", data: createdGift });
};


exports.getAllGifts = async (req, res) => {
  await gift.aggregate([
    {
      $match: {}
    },
    {
      $lookup: {
        from: "admins",
        foreignField: "_id",
        localField: "createdBy",
        as: "actionBy"
      }
    }
  ])
    .then(success => {
      return res.json({
        status: true,
        message: "All gifts",
        data: success
      })
    })
    .catch(error => {
      return res.json({
        status: false,
        message: "error"
      })
    })
}

exports.updateGift = async (req, res) => {
  const { giftId } = req.params;
  const update_data = req.body

  let displayPhoto;
  if (req.file)
    displayPhoto = req.file.filename

  await gift.findOneAndUpdate({ _id: mongoose.Types.ObjectId(giftId) },
    {
      $set: update_data
    })
    .then(success => {
      return res.json({
        status: true,
        message: "gift updated",
        data: success
      })
    })
    .catch(error => {
      return res.json({
        status: false,
        message: "error"
      })
    })
};


exports.deleteGift = async (req, res) => {
  const { giftId } = req.params

  await gift.findByIdAndDelete({ _id: giftId })
    .then(success => {
      return res.json({
        status: true,
        message: "gift deleted",
        data: success
      })
    })
    .catch(error => {
      return res.json({
        status: false,
        message: "error"
      })
    })
}

const salary = require("../model/salary.model");
const bannedUserModel = require("../model/bannedUsers.model");
const salaryHistory_Model = require("../model/salaryHistory.model");

exports.createSalary = async (req, res) => {
  const { userId, coins } = req.body;

  try {
    const newSalary = new salary({
      userId: userId,
      coins: coins,
    });

    await newSalary.save();

    return res.status(201).json({
      success: true,
      message: "Salary entry created successfully",
      data: newSalary,
    });
  } catch (error) {
    console.error("Error creating salary entry:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create salary entry",
      error: error.message,
    });
  }
};

exports.createBanner = async (req, res) => {
  const { name, whatsapp, link, createdBy } = req.body;

  try {
    if (!req.file)
      return res.json({
        status: false,
        message: `please select image`,
      });

    const displayPhoto = req.file.filename;

    const newBanner = new Banner({
      name: name,
      image: displayPhoto,
      whatsapp: whatsapp,
      link: link,
      createdBy: createdBy
    });

    const savedBanner = await newBanner.save();

    return res.status(201).json({
      success: true,
      message: 'Banner created successfully',
      data: savedBanner,
    });
  } catch (error) {
    console.error('Error creating banner:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create banner',
      error: error.message,
    });
  }
};

exports.getAllBanners = async (req, res) => {
  await Banner.aggregate([
    {
      $match: {}
    },
    {
      $lookup: {
        from: "admins",
        foreignField: "_id",
        localField: "createdBy",
        as: "actionBy"
      }
    }
  ])
    .then(success => {
      return res.json({
        status: true,
        message: "All banners",
        data: success
      })
    })
    .catch(error => {
      return res.json({
        status: false,
        message: "error"
      })
    })
}

exports.updateBanner = async (req, res) => {
  const { bannerId } = req.params;
  const update_data = req.body

  let displayPhoto;
  if (req.file)
    displayPhoto = req.file.filename

  await Banner.findOneAndUpdate({ _id: mongoose.Types.ObjectId(bannerId) },
    {
      $set: update_data
    })
    .then(success => {
      return res.json({
        status: true,
        message: "banner updated",
        data: success
      })
    })
    .catch(error => {
      return res.json({
        status: false,
        message: "error"
      })
    })
};


exports.deleteBanner = async (req, res) => {
  const { bannerId } = req.params

  await Banner.findByIdAndDelete({ _id: bannerId })
    .then(success => {
      return res.json({
        status: true,
        message: "banner deleted",
        data: success
      })
    })
    .catch(error => {
      return res.json({
        status: false,
        message: "error"
      })
    })
}


exports.getBanUser = async (req, res) => {
  await bannedUserModel.aggregate([
    {
      $match: {}
    },
    {
      $lookup: {
        from: "users",
        foreignField: "_id",
        localField: "userId",
        as: "user_info"
      }
    },
    {
      $lookup: {
        from: "admins",
        foreignField: "_id",
        localField: "createdBy",
        as: "actionBy"
      }
    }
  ])
    .then(success => {
      return res.json({
        status: true,
        message: "banned user",
        data: success
      })
    })
    .catch(error => {
      return res.json({
        status: false,
        message: "error"
      })
    })
}

exports.unbanUser = async (req, res) => {
  const { id } = req.params
  await bannedUserModel.findByIdAndDelete({ _id: id })
    .then(success => {
      return res.json({
        status: true,
        message: "user unbanned",
        data: success
      })
    })
    .catch(error => {
      return res.json({
        status: false,
        message: "error"
      })
    })
}

exports.clearUserSalary = async (req, res) => {
  const { userId, salary, percent, createdBy } = req.body

  const isUserFound = await userModel.findOne({
    _id: mongoose.Types.ObjectId(userId),
  });
  if (!isUserFound) {
    return res.json({
      success: false,
      message: "user not found",
    });
  }


  const totalEarning = isUserFound.LiveEarningcoin
  const coinRemaing = totalEarning - salary
  console.log(coinRemaing)
  if (totalEarning < salary) {
    return res.json({
      success: false,
      message: "not enough coins",
    });
  }

  await new salaryHistory_Model({
    user_id: userId,
    cleared_salary: salary,
    percentage: percent,
    createdBy: createdBy
  })
    .save()
    .then(async (success) => {
      await userModel.findOneAndUpdate({ _id: mongoose.Types.ObjectId(userId) },
        {
          $set: { LiveEarningcoin: coinRemaing }
        })

      return res.json({
        success: true,
        message: "salary Cleared.",
      });
    })
    .catch(error => {
      return res.json({
        success: false,
        message: "something went wrong", error,
      });
    })

}


exports.getSalaryHistory = async (req, res) => {
  await salaryHistory_Model.aggregate([
    {
      $match: {}
    },
    {
      $lookup: {
        from: "users",
        foreignField: "_id",
        localField: "user_id",
        as: "user_info"
      }
    },
    {
      $lookup: {
        from: "admins",
        foreignField: "_id",
        localField: "createdBy",
        as: "actionBy"
      }
    }
  ])
    .then(success => {
      return res.json({
        success: true,
        message: "salary history",
        data: success
      });
    })
    .catch(error => {
      return res.json({
        success: false,
        message: "something went wrong", error,
      });
    })
}