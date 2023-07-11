const { default: mongoose, trusted, mongo } = require("mongoose");
const liveModel = require("../model/Live/Live.model");
const liveJoinedModel = require("../model/Live/liveUsers.model");
const requestedUsersLiveModel = require("../model/Live/requesJoin.model");
const userModel = require("../model/user.model");
const liveEarningHostory = require("../model/LiveStreamEarningHistory.model");
const liveearningModel = require("../model/LiveStreamEarningHistory.model");

exports.goLive = async (req, res) => {
  const { userId, liveUniqueId, channelName, hostId } = req.body;

  await new liveModel({
    userId: userId,
    liveUniqueId: liveUniqueId,
    channelName: channelName,
  })
    .save()
    .then((success) => {
      return res.json({
        status: true,
        message: "Live details added",
        data: success
      });
    })
    .catch((error) => {
      return res.json({
        status: false,
        message: "error",
      });
    });
};

exports.getLives = async (req, res) => {
  await liveModel
    .aggregate([
      {
        $match: { isEnded: false },
      },
      {
        $lookup: {
          from: "users",
          foreignField: "_id",
          localField: "userId",
          as: "user",
        },
      },
    ])
    .then((success) => {
      return res.json({
        status: true,
        message: "Live details",
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

exports.watchLive = async (req, res) => {
  const { userId, liveId, hostId } = req.body;

  const isuseriskicked = await userModel.findOne(
    { _id: hostId, kickedUser: { $in: [userId] } }
  );

  console.log(isuseriskicked)
  if (isuseriskicked) {
    return res.json({
      status: false,
      message: "you are kicked"
    })
  }

  const liveData = await liveModel.findOne({
    _id: mongoose.Types.ObjectId(liveId),
  });

  let blockedUsers = liveData.blockedUsers;

  const isUserBlocked = await liveModel.findOne({
    userId: { $in: blockedUsers },
  });

  if (isUserBlocked) {
    return res.json({
      status: false,
      message: "you are blocked by host not able to join",
    });
  }

  if (!liveData) {
    return res.json({
      status: false,
      message: "invalid live id",
    });
  }

  const isliveEnded = await liveModel.findOne({
    _id: mongoose.Types.ObjectId(liveId),
    isEnded: true,
  });

  if (isliveEnded) {
    return res.json({
      status: false,
      message: "live was ended",
    });
  }

  new liveJoinedModel({
    userId: userId,
    liveId: liveId,
  })
    .save()
    .then((success) => {
      return res.json({
        status: true,
        message: "you are adding to Live watchList",
      });
    })
    .catch((error) => {
      return res.json({
        status: false,
        message: "error",
      });
    });
};

exports.liveUserUpdate = async (req, res) => {
  const { liveId, userId, status } = req.body

  await liveJoinedModel.findOneAndUpdate({
    liveId: mongoose.Types.ObjectId(liveId),
    userId: mongoose.Types.ObjectId(userId),
  }, {
    $set: {
      status: status
    }
  })
  .then(success=>{
    return res.json({
      status:true,
      message:"updated"
    })
  })
  .catch(error=>{
    return res.json({
      status:false,
      message:"updated"
    })
  })
}

exports.addUserInBlockList = async (req, res) => {
  const { userId, liveId } = req.body;

  await liveModel
    .findOneAndUpdate({ _id: liveId }, { $push: { blockedUsers: userId } })
    .then((success) => {
      return res.json({
        status: true,
        message: "user added into blocklist",
      });
    })
    .catch((error) => {
      return res.json({
        status: false,
        message: "error",
      });
    });
};

exports.endLive = async (req, res) => {
  const { liveId } = req.params;

  await liveModel
    .findOneAndUpdate(
      { _id: mongoose.Types.ObjectId(liveId) },
      {
        $set: { isEnded: true },
      }
    )
    .then((success) => {
      return res.json({
        status: true,
        message: "live was ended",
      });
    })
    .catch((error) => {
      return res.json({
        status: false,
        message: "error",
      });
    });
};

exports.stopWatchingLive = async (req, res) => {
  const { liveId, userId } = req.body;

  await liveJoinedModel
    .findOneAndDelete({
      $and: [
        { userId: mongoose.Types.ObjectId(userId) },
        { liveId: mongoose.Types.ObjectId(liveId) },
      ],
    })
    .then((success) => {
      return res.json({
        status: true,
        message: "you left from live watching list",
      });
    })
    .catch((error) => {
      return res.json({
        status: false,
        message: "error",
      });
    });
};

exports.requestToJoinWithLive = async (req, res) => {
  const { userId, liveId } = req.body;

  const liveData = await liveModel.findOne({
    _id: mongoose.Types.ObjectId(liveId),
  });

  let blockedUsers = liveData.blockedUsers;

  const isUserBlocked = await liveModel.findOne({
    userId: { $in: blockedUsers },
  });

  if (isUserBlocked) {
    return res.json({
      status: false,
      message: "you are blocked by host not able to join",
    });
  }

  if (!liveData) {
    return res.json({
      status: false,
      message: "invalid live id",
    });
  }

  const isAlreadyRequestSend = await requestedUsersLiveModel.findOne({
    userId: mongoose.Types.ObjectId(userId),
    liveId: mongoose.Types.ObjectId(liveId),
  });

  console.log("isAlreadyRequestSend ==>", isAlreadyRequestSend);

  if (isAlreadyRequestSend) {
    return res.json({
      status: false,
      message: "you already requested",
    });
  }

  const isRequestSend = await new requestedUsersLiveModel({
    userId: userId,
    liveId: liveId,
  }).save();
  console.log("isRequestSend ==>", isRequestSend);

  if (isRequestSend) {
    return res.json({
      status: true,
      message: "request send to user",
      data: isRequestSend,
    });
  } else {
    return res.json({
      status: false,
      message: "invalid live id",
    });
  }
};

exports.updateLiveJoinRequest = async (req, res) => {
  const { userId, liveId, status } = req.body;

  const liveData = await liveModel.findOne({
    _id: mongoose.Types.ObjectId(liveId),
  });

  let blockedUsers = liveData.blockedUsers;

  const isUserBlocked = await liveModel.findOne({
    userId: { $in: blockedUsers },
  });

  if (isUserBlocked) {
    return res.json({
      status: false,
      message: "you are blocked by host not able to join",
    });
  }

  if (!liveData) {
    return res.json({
      status: false,
      message: "invalid live id",
    });
  }

  await requestedUsersLiveModel
    .findOneAndUpdate(
      {
        userId: userId,
        liveId: liveId,
      },
      {
        $set: {
          status: status,
        },
      }
    )
    .then((success) => {
      return res.json({
        status: true,
        message: `user status changed to ${status}`,
      });
    })
    .catch((error) => {
      return res.json({
        status: false,
        message: "error",
      });
    });
};

exports.getPendingRequests = async (req, res) => {
  const { liveId } = req.params;
  console.log(liveId);

  const aggregateResult = await requestedUsersLiveModel.aggregate([
    {
      $match: { liveId: liveId },
    },
  ]);
  console.log("d==>", aggregateResult);

  await requestedUsersLiveModel
    .aggregate([
      {
        $match: { liveId: liveId, status: 0 },
      },
      {
        $lookup: {
          from: "users",
          foreignField: "_id",
          localField: "userId",
          as: "user",
        },
      },
    ])
    .then((success) => {
      return res.json({
        status: true,
        message: `pending request are`,
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

exports.getAcceptedRequests = async (req, res) => {
  const { liveId } = req.params;

  await requestedUsersLiveModel
    .aggregate([
      {
        $match: { liveId: liveId, status: 1 },
      },
      {
        $lookup: {
          from: "users",
          foreignField: "_id",
          localField: "userId",
          as: "user",
        },
      },
    ])
    .then((success) => {
      return res.json({
        status: true,
        message: `accepted request are`,
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

exports.kickFromLive = async (req, res) => {
  const { liveId, userId } = req.body;

  const us = await requestedUsersLiveModel.find({
    liveId: liveId,
    userId: mongoose.Types.ObjectId(userId),
    // liveId: '647da74a0b24795aaf086883'
  });

  console.log(us);
  await requestedUsersLiveModel
    .findOneAndDelete({
      liveId: liveId,
      userId: mongoose.Types.ObjectId(userId),
    })
    .then((success) => {
      return res.json({
        status: true,
        message: `user has been kicked out`,
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

exports.getLiveById = async (req, res) => {
  const { liveId } = req.params;

  const liveData = await liveModel.findOne({
    _id: mongoose.Types.ObjectId(liveId),
  });

  if (!liveData) {
    return res.json({
      status: false,
      message: "invalid live id",
    });
  }

  if (liveData.isEnded == true) {
    return res.json({
      status: false,
      message: "live is ended",
    });
  }

  await liveModel
    .aggregate([
      { $match: { _id: mongoose.Types.ObjectId(liveId) } },
      {
        // $lookup: {
        //   from: "live_joineds",
        //   foreignField: "liveId",
        //   localField: "_id",
        //   as: "liveUsers",
        // },
        $lookup: {
          from: "live_joineds",
          let: { liveId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$liveId", "$$liveId"] },
              },
            },
            {
              $lookup: {
                from: "users",
                foreignField: "_id",
                localField: "userId",
                as: "user_data",
              },
            },
            {
              $unwind: "$user_data",
            },
          ],
          as: "LiveUser",
        },
      },
    ])
    .then((success) => {
      return res.json({
        status: true,
        message: `joined users`,
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

exports.sendCoin = async (req, res) => {
  const { liveId, senderId, reciverId, coin } = req.body;

  const isSenderExists = await userModel.findOne({
    _id: mongoose.Types.ObjectId(senderId),
  });

  if (!isSenderExists) {
    return res.json({
      status: false,
      message: "no sender exists",
    });
  }

  const isreciverExists = await userModel.findOne({
    _id: mongoose.Types.ObjectId(reciverId),
  });

  if (!isreciverExists) {
    return res.json({
      status: false,
      message: "no reciver exists",
    });
  }

  const isLiveExists = await liveModel.findOne({
    _id: mongoose.Types.ObjectId(liveId),
  });

  if (!isLiveExists) {
    return res.json({
      status: false,
      message: "no live exists",
    });
  }

  if (isSenderExists.coin < coin) {
    return res.json({
      status: false,
      message: "not enough coins",
    });
  }

  // console.log(isreciverExists.LiveEarningcoin);
  let liveCoin = isLiveExists.coin + coin;
  let senderCoin = isSenderExists.coin - coin;
  let reciverLiveCoins = isreciverExists.LiveEarningcoin;

  await liveModel.findOneAndUpdate(
    { _id: mongoose.Types.ObjectId(liveId) },
    { $set: { coin: liveCoin } }
  );

  await userModel.findOneAndUpdate(
    { _id: mongoose.Types.ObjectId(senderId) },
    { $set: { coin: senderCoin } }
  );

  await userModel.findOneAndUpdate(
    { _id: mongoose.Types.ObjectId(reciverId) },
    { $set: { LiveEarningcoin: isreciverExists.LiveEarningcoin + coin } }
  );

  await liveModel
    .findOneAndUpdate(
      { _id: mongoose.Types.ObjectId(liveId) },
      { $set: { coin: liveCoin } }
    )
    .then(async (success) => {
      await new liveEarningHostory({
        senderId: senderId,
        receiverId: reciverId,
        coin: coin,
        liveId: liveId,
      }).save();

      return res.json({
        status: true,
        message: "coin sends with user",
        data: success,
      });
    })
    .catch((error) => {
      return res.json({
        status: false,
        message: "eorro",
      });
    });
};

exports.getLiveEarningHistory = async (req, res) => {
  liveearningModel
    .aggregate([
      {
        $lookup: {
          from: "users",
          foreignField: "_id",
          localField: "senderId",
          as: "sender",
        },
      },
      {
        $lookup: {
          from: "users",
          foreignField: "_id",
          localField: "receiverId",
          as: "receiver",
        },
      },
      {
        $lookup: {
          from: "lives",
          foreignField: "_id",
          localField: "liveId",
          as: "live",
        },
      },
    ])
    .then((success) => {
      return res.json({
        status: true,
        message: "live earning history",
        data: success,
      });
    })
    .catch((error) => {
      return res.json({
        status: false,
        message: "eror",
      });
    });
};

exports.getLiveEarningHistorybylive = async (req, res) => {
  liveearningModel
    .aggregate([
      {
        $match: { liveId: mongoose.Types.ObjectId(req.params.liveId) },
      },
      {
        $lookup: {
          from: "users",
          foreignField: "_id",
          localField: "senderId",
          as: "sender",
        },
      },
      {
        $lookup: {
          from: "users",
          foreignField: "_id",
          localField: "receiverId",
          as: "receiver",
        },
      },
      {
        $lookup: {
          from: "lives",
          foreignField: "_id",
          localField: "liveId",
          as: "live",
        },
      },
    ])
    .then((success) => {
      return res.json({
        status: true,
        message: "live earning history",
        data: success,
      });
    })
    .catch((error) => {
      return res.json({
        status: false,
        message: "eror",
      });
    });
};

exports.muteUser = async (req, res) => {
  const { liveId, userId } = req.body
  liveModel.updateOne(
    { _id: mongoose.Types.ObjectId(liveId) },
    { $push: { mutedUser: userId } },
    (err, result) => {
      if (err) {
        console.error(err);
        // Handle the error
      } else {
        return res.json({
          status: true,
          message: "Muted user added successfully"
        })
      }
    }
  );
}

exports.kickUser = async (req, res) => {
  const { kickedUserId, hostId } = req.body;

  try {
    const result = await userModel.updateOne(
      { _id: mongoose.Types.ObjectId(hostId) },
      { $push: { kickedUser: kickedUserId } }
    );

    if (result.nModified === 1) {
      return res.json({
        status: true,
        message: "User kicked successfully",
        data: result,
      });
    } else {
      return res.json({
        status: false,
        message: "kicked user",
      });
    }
  } catch (err) {
    console.error(err);
    // Handle the error
    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
};

exports.getkickedUser = async (req, res) => {
  const { hostId } = req.params

  const user = await userModel.findOne({ _id: mongoose.Types.ObjectId(hostId) })
  // console.log(user)
  let kickedUser
  if (user) kickedUser = user.kickedUser
  let len = kickedUser.length


  let kicked = []
  if (kickedUser) {
    kickedUser.map(async (kickedUser, i) => {
      const user = await userModel.findOne({ _id: kickedUser })
      kicked.push(user)
      if (len === i + 1)
        ret()

    })
  }

  function ret() {
    return res.json({
      status: true,
      message: "kicked users",
      user: kicked
    })
  }

}

exports.removekickUser = async (req, res) => {
  const { kickedUserId, hostId } = req.body;

  try {
    const result = await userModel.updateOne(
      { _id: mongoose.Types.ObjectId(hostId) },
      { $pull: { kickedUser: kickedUserId } }
    );

    if (result.nModified === 1) {
      return res.json({
        status: true,
        message: "User kicked successfully",
        data: result,
      });
    } else {
      return res.json({
        status: false,
        message: "un-kicked user",
      });
    }
  } catch (err) {
    console.error(err);
    // Handle the error
    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
};

