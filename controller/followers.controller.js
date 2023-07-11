const { default: mongoose } = require("mongoose");
const followers = require("../model/followers.model");
const users = require("../model/user.model");

exports.follow_user = async (req, res) => {
  const { following_from, following_to } = req.body;

  const is_already_following = await followers.findOne({
    following_from: following_from,
    following_to: following_to,
  });
  if (is_already_following) {
    return res.json({
      status: false,
      message: `you already following this user`,
    });
  }

  await new followers({
    following_from: following_from,
    following_to: following_to,
  })
    .save()
    .then(async (success) => {
      return res.json({
        status: true,
        message: `followed successfully`,
        data: success,
      });
    })
    .catch((error) => {
      return res.json({
        status: false,
        message: `something went wrong`,
        error,
      });
    });
};

exports.unFollow_user = async (req, res) => {
  const { following_from, following_to } = req.body;

  await followers
    .findOneAndDelete({
      following_from: following_from,
      following_to: following_to,
    })
    .then((success) => {
      if (success == null) {
        return res.json({
          status: true,
          message: `o data found`,
          data: success,
        });
      }
      if (success)
        return res.json({
          status: true,
          message: `unFollowed successfully`,
          data: success,
        });
    })
    .catch((error) => {
      return res.json({
        status: false,
        message: `something went wrong`,
        error,
      });
    });
};

exports.get_user_followers = async (req, res) => {
  const { user_id } = req.params;

  await followers
    .aggregate([
      {
        $match: { following_to: mongoose.Types.ObjectId(user_id) },
      },
      {
        $lookup: {
          from: "users",
          foreignField: "_id",
          localField: "following_from",
          as: "follower_details",
        },
      },
      {
        $unwind: {
          path: "$follower_details",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 0,
          "follower_details._id": 1,
          "follower_details.name": 1,
          "follower_details.photo": 1,
        },
      },
    ])
    .then((success) => {
      if (success)
        return res.json({
          status: true,
          message: `followers details`,
          data: success,
        });
    })
    .catch((error) => {
      return res.json({
        status: false,
        message: `something went wrong`,
        error,
      });
    });
};

exports.get_user_following = async (req, res) => {
  const { user_id } = req.params;

  await followers
    .aggregate([
      {
        $match: { following_from: mongoose.Types.ObjectId(user_id) },
      },
      {
        $lookup: {
          from: "users",
          foreignField: "_id",
          localField: "following_to",
          as: "following_details",
        },
      },
      {
        $unwind: {
          path: "$following_details",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 0,
          "following_details._id": 1,
          "following_details.name": 1,
          "following_details.photo": 1,
        },
      },
    ])
    .then((success) => {
      if (success)
        return res.json({
          status: true,
          message: `following details`,
          data: success,
        });
    })
    .catch((error) => {
      return res.json({
        status: false,
        message: `something went wrong`,
        error,
      });
    });
};
