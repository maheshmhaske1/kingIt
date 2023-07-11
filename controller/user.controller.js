const userModel = require("../model/user.model");
const postModel = require("../model/post.model");
const mailMiddleware = require("../middleware/mail.middleware");
const jwtMiddleware = require("../middleware/auth");
const fs = require("fs-extra");
const bcrypt = require("bcrypt");
const fetch = require("node-fetch");
const { default: mongoose } = require("mongoose");
const commentModel = require("../model/comment.model");
const likeModel = require("../model/like.model");
const dotenv = require("dotenv").config();
const posts = require("../model/post.model");
const storeModel = require("../model/store.model");
const userStoreModel = require("../model/userStore.model");
const bannedDeviceModel = require("../model/bannedDevice.model");

exports.createUser = async (req, res) => {
  let { name, email, mobile, about, dob, gender, country } = req.body;

  const isUserFound = await userModel.findOne({ email: email });
  if (isUserFound) {
    return res.json({
      success: false,
      message: "user already exist please login",
    });
  }
  let id = "";
  let lastUser = await userModel.find({});
  lastUser = lastUser[lastUser.length - 1];
  let lastUserId = "";
  if (lastUser) {
    lastUserId = lastUser.id;
  }

  if (lastUserId == undefined || !lastUser) {
    id = "000001";
  } else {
    function incrementString(str) {
      const numericPart = parseInt(str.match(/\d+/), 10);
      const incrementedNumericPart = (numericPart + 1).toString();
      const leadingZeros = 6 - incrementedNumericPart.length;
      const result = "0".repeat(leadingZeros) + incrementedNumericPart;
      return result;
    }
    const input = lastUserId;
    const output = incrementString(input);
    id = output;
  }

  await new userModel({
    name: name,
    email: email,
    mobile: mobile,
    dob: dob,
    photo: "",
    about: about,
    gender: gender,
    id: id,
    country: country
  })
    .save()
    .then(async (success) => {
      const token = await jwtMiddleware.generate_token_user(
        success._id,
        success.mobile
      );
      await userModel
        .findOneAndUpdate(
          { _id: mongoose.Types.ObjectId(success._id) },
          { $set: { token: token } },
          { returnOriginal: false }
        )
        .then((success) => {
          return res.json({
            success: true,
            message: `user registered`,
            data: success,
          });
        })
        .catch((error) => {
          return res.json({
            success: false,
            message: "something went wrong",
            error,
          });
        });
    })
    .catch((error) => {
      return res.json({
        success: false,
        message: "something went wrong",
        error,
      });
    });
};

exports.login = async (req, res) => {
  let { mobile, otp } = req.body;

  const isUserFound = await userModel.findOne({ mobile: mobile });


  if (!isUserFound) {
    return res.json({
      success: false,
      message: "user not registered please register",
    });
  }

  if (isUserFound.isBlocked == true) {
    return res.json({
      success: false,
      message: "you are blocked",
    });
  }


  if (otp === 1122) {
    return res.json({
      success: true,
      message: `logged in`,
      data: isUserFound,
    });
  } else {
    return res.json({
      success: false,
      message: `incorrect otp`,
    });
  }
};

exports.sendOtp = async (req, res) => {
  const { mobile } = req.params;

  return res.json({
    status: true,
    message: "your otp is 1122",
  });
};

exports.verifyOtp = async (req, res) => {
  const { mobile, otp } = req.params;
  console.log(otp);
  if (otp == 1122)
    return res.json({
      status: true,
      message: "otp verified",
    });
  if (otp != 1122)
    return res.json({
      status: false,
      message: "otp is incorrect",
    });
};

exports.resetPassword = async (req, res) => {
  let { username, newPassword, otp } = req.body;

  let error_message = `please enter`;

  if (!username) {
    error_message += `, email`;
  }
  if (!newPassword) {
    error_message += `, password`;
  }
  if (!otp) {
    error_message += `, otp`;
  }

  if (error_message !== "please enter") {
    return res.json({
      success: false,
      message: error_message,
    });
  }

  const isUserFound = await userModel.findOne({ email: username });
  console.log(isUserFound);
  if (!isUserFound) {
    return res.json({
      success: false,
      message: "user not registered please register",
    });
  }

  const isValidOtp = await otpModel
    .findOne({ email: username })
    .sort({ _id: -1 })
    .then(async (success) => {
      if (!success) {
        return res.json({
          success: false,
          message: `record not found`,
        });
      } else {
        if (otp == success.otp && success.validTill > Date.now()) {
          const hashedNewPassword = await bcrypt.hash(newPassword, 10);
          console.log("hashedNewPassword ==>", hashedNewPassword);
          console.log("newPassword ==>", newPassword);
          console.log("Usrname ==>", username);
          await userModel
            .findByIdAndUpdate(
              { _id: isUserFound._id },
              {
                $set: {
                  password: hashedNewPassword,
                },
              }
            )
            .then((success) => {
              console.log(success);
              if (success) {
                return res.json({
                  success: true,
                  message: "password changed successfully",
                });
              }
              x;
            })
            .catch((error) => {
              return res.json({
                success: false,
                message: "error while changing password",
              });
            });
        } else if (otp == success.otp && success.validTill < Date.now()) {
          return res.json({
            success: false,
            message: "otp expired",
          });
        } else {
          return res.json({
            success: false,
            message: "otp not matched",
          });
        }
      }
    })
    .catch((error) => {
      return res.json({
        success: false,
        message: "something went wrong",
        error,
      });
    });

  console.log(isValidOtp);
};

exports.isUserExist = async (req, res) => {
  let { mobile } = req.body;

  const isUserFound = await userModel.findOne({ mobile: mobile });
  if (!isUserFound) {
    return res.json({
      success: false,
      message: "email not registered",
    });
  } else {
    return res.json({
      success: true,
      message: "user found",
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
  }

  await userModel
    .aggregate([
      {
        $match: { _id: mongoose.Types.ObjectId(userId) },
      },
      {
        $lookup: {
          from: "userstoreitems",
          foreignField: "userId",
          localField: "_id",
          as: "storeItems",
        },
      },
    ])
    .then((success) => {
      return res.json({
        success: true,
        message: "user details",
        data: success,
      });
    })
    .catch((error) => {
      return res.json({
        success: false,
        message: "something went wrong",
      });
    });
  // else {
  //   return res.json({
  //     success: true,
  //     message: "user details",
  //     data: isUserFound,
  //   });
  // }
};

exports.deleteUser = async (req, res) => {
  let { userId } = req.params;

  if (!userId) {
    return res.json({
      success: false,
      message: "please provide userId",
    });
  }

  await userModel
    .findOneAndDelete({ _id: mongoose.Types.ObjectId(userId) })
    .then(async (success) => {
      const post = await postModel.find({
        userId: mongoose.Types.ObjectId(userId),
      });
      console.log("post===>", post);

      await postModel.deleteMany({ userId: mongoose.Types.ObjectId(userId) });
      await commentModel.deleteMany({
        userId: mongoose.Types.ObjectId(userId),
      });
      await likeModel.deleteMany({ userId: mongoose.Types.ObjectId(userId) });

      return res.json({
        status: true,
        message: `user deleted successfully`,
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

exports.getAll = async (req, res) => {
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

exports.updateUserStore = async (req, res) => {
  const { storeId, userId, inUse } = req.body;

  await userStoreModel
    .findOneAndUpdate(
      {
        userId: mongoose.Types.ObjectId(userId),
        storeId: mongoose.Types.ObjectId(storeId),
      },
      {
        $set: { inUse: inUse },
      },
      { returnOriginal: false }
    )
    .then((success) => {
      return res.json({
        success: false,
        message: "user store detail updated",
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

exports.update = async (req, res) => {
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

exports.addUserWallet = async (req, res) => {
  const { userId, price } = req.body;

  if (!userId) {
    return res.json({
      status: false,
      message: "userId required",
    });
  }

  const isUserExist = await userModel.findOne({
    _id: mongoose.Types.ObjectId(userId),
  });
  if (!isUserExist) {
    return res.json({
      status: false,
      message: "invalid userId",
    });
  }

  await userModel
    .findOneAndUpdate(
      { _id: mongoose.Types.ObjectId(userId) },
      {
        $set: {
          wallet: isUserExist.wallet + price,
        },
      },
      { returnOriginal: false }
    )
    .then((success) => {
      return res.json({
        success: true,
        message: `money added in user wallet`,
        data: success,
      });
    })
    .catch((error) => {
      return res.json({
        success: false,
        message: "something went wrong",
        error,
      });
    });
};

exports.sendGift = async (req, res) => {
  const { sender, receiver, coin } = req.body;

  const senderr = await userModel.findOne({
    _id: mongoose.Types.ObjectId(sender),
  });
  const receivere = await userModel.findOne({
    _id: mongoose.Types.ObjectId(receiver),
  });

  if (!senderr) {
    return res.json({
      status: false,
      message: "invalid sender",
    });
  }

  if (!receivere) {
    return res.json({
      status: false,
      message: "invalid sender",
    });
  }

  if (senderr.coin < coin) {
    return res.json({
      status: false,
      message: "not enough coin",
    });
  }

  const sender_coin = senderr.coin - coin;
  const reciver_coin = receivere.coin + coin;

  await userModel.findOneAndUpdate(
    { _id: mongoose.Types.ObjectId(sender) },
    {
      $set: { coin: sender_coin },
    }
  );

  await userModel
    .findOneAndUpdate(
      { _id: mongoose.Types.ObjectId(receiver) },
      {
        $set: { coin: reciver_coin },
      }
    )
    .then((success) => {
      return res.json({
        success: true,
        message: `${coin} send to sender successfully`,
        data: success,
      });
    })
    .catch((error) => {
      return res.json({
        success: true,
        message: `error`,
        data: success,
      });
    });
};

/* ---------- remove profile image ------------ */
exports.remove_profile_img = async (req, res) => {
  const { user_id, key } = req.body;

  if (!user_id)
    return res.json({
      status: false,
      message: `please provide user_id`,
    });

  const users = await userModel.findOne({
    _id: mongoose.Types.ObjectId(user_id),
  });
  if (!users)
    return res.json({
      status: false,
      message: `invalid user_id`,
    });

  userModel
    .findByIdAndUpdate(
      { _id: user_id },
      key == 1 ? { $set: { photo: "" } } : { $set: { cover_photo: "" } },
      { returnOriginal: true }
    )
    .then(async (success) => {
      let filename = key == 1 ? success.photo : success.cover_photo;
      console.log("filename ==>", success);
      console.log("filename ===>", filename);

      if (filename) {
        await fs.remove(`./public/profile_images/${filename}`); // remove upload dir when uploaded bucket
      }

      return res.json({
        status: true,
        message: `image removed`,
      });
    });
};

/* ---------- update profile image ------------ */
exports.add_profile_image = async (req, res) => {
  const { user_id } = req.params;

  if (!req.file)
    return res.json({
      status: false,
      message: `please select image`,
    });

  if (!user_id)
    return res.json({
      status: false,
      message: `please select user_id`,
    });

  const users = await userModel.findById({ _id: user_id });
  if (users == null || !users)
    return res.json({
      status: false,
      message: `invalid user_id`,
    });

  const displayPhoto = req.file.filename;
  console.log(displayPhoto);
  userModel
    .findByIdAndUpdate(
      { _id: user_id },
      {
        $set: { photo: displayPhoto },
      },
      { returnOriginal: true }
    )
    .then(async (success) => {
      console.log("success==>", success);
      let filename = success.photo;
      let root_url = req.protocol + "://" + req.headers.host;
      let profile_url = root_url + "/profile_images/" + displayPhoto;

      return res.json({
        status: true,
        message: `profile image updated successfully`,
        data: {
          user_id: success._id,
          profile_images: profile_url,
        },
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

/* ---------- update profile image ------------ */
exports.add_cover_image = async (req, res) => {
  const { user_id } = req.params;

  if (!req.file)
    return res.json({
      status: false,
      message: `please select image`,
    });

  if (!user_id)
    return res.json({
      status: false,
      message: `please select user_id`,
    });

  const users = await userModel.findById({ _id: user_id });
  if (users == null || !users)
    return res.json({
      status: false,
      message: `invalid user_id`,
    });

  const displayPhoto = req.file.filename;
  console.log(displayPhoto);
  userModel
    .findByIdAndUpdate(
      { _id: user_id },
      {
        $set: { cover_photo: displayPhoto },
      },
      { returnOriginal: true }
    )
    .then(async (success) => {
      console.log("success==>", success);
      let filename = success.photo;
      let root_url = req.protocol + "://" + req.headers.host;
      let profile_url = root_url + "/profile_images/" + displayPhoto;

      return res.json({
        status: true,
        message: `profile image updated successfully`,
        data: {
          user_id: success._id,
          profile_images: profile_url,
        },
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

exports.addPost = async (req, res) => {
  const userId = req.params.userId;
  const { caption } = req.body;

  if (!userId) {
    return res.json({
      status: false,
      message: "please provide userId",
    });
  }

  console.log(req.file);
  if (!req.file)
    return res.json({
      status: false,
      message: `please select image`,
    });

  const users = await userModel.findById({ _id: userId });
  if (users == null || !users)
    return res.json({
      status: false,
      message: `invalid user_id`,
    });

  const displayPhoto = req.file.filename;
  console.log(displayPhoto);
  await new postModel({
    userId: userId,
    postUrl: displayPhoto,
    caption: caption,
  })
    .save()
    .then(async (success) => {
      return res.json({
        status: true,
        message: `post added successfully`,
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

exports.getUserPost = async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.json({
      status: false,
      message: "please provide userId",
    });
  }

  const users = await userModel.findById({ _id: userId });
  if (users == null || !users)
    return res.json({
      status: false,
      message: `invalid user_id`,
    });

  await postModel
    .aggregate([
      {
        $match: { userId: mongoose.Types.ObjectId(userId) },
      },
      {
        $lookup: {
          from: "users",
          foreignField: "_id",
          localField: "userId",
          as: "userDetails",
        },
      },
      {
        $lookup: {
          from: "comments",
          let: { postId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$postId", "$$postId"] },
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
          as: "comments",
        },
      },
      {
        $lookup: {
          from: "likes",
          foreignField: "postId",
          localField: "_id",
          as: "likes",
        },
      },
    ])
    .then(async (success) => {
      console.log(success);
      return res.json({
        status: true,
        message: `user post details`,
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

// exports.getAllPost = async (req, res) => {};
exports.getAllPost = async (req, res) => {
  await postModel
    .aggregate([
      {
        $match: {},
      },
      {
        $lookup: {
          from: "users",
          foreignField: "_id",
          localField: "userId",
          as: "userDetails",
        },
      },
      {
        $lookup: {
          from: "comments",
          let: { postId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$postId", "$$postId"] },
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
          as: "comments",
        },
      },
      {
        $lookup: {
          from: "likes",
          foreignField: "postId",
          localField: "_id",
          as: "likes",
        },
      },
      {
        $lookup: {
          from: "users",
          foreignField: "_id",
          localField: "likes.userId",
          as: "likes.user_data",
        },
      },
      {
        $unwind: {
          path: "$likes.user_data",
          preserveNullAndEmptyArrays: true,
        },
      },
    ])
    .then(async (success) => {
      console.log(success);
      return res.json({
        status: true,
        message: `user post details`,
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

exports.deletePost = async (req, res) => {
  const { postId } = req.params;

  if (!postId) {
    return res.json({
      status: false,
      message: "please provide postId",
    });
  }

  const isPostExist = await postModel.findOne({
    _id: mongoose.Types.ObjectId(postId),
  });

  if (!isPostExist) {
    return res.json({
      status: false,
      message: "please provide valid postId",
    });
  }

  await postModel
    .findOneAndDelete({
      _id: mongoose.Types.ObjectId(postId),
    })
    .then(async (success) => {
      await commentModel.deleteMany({
        postId: mongoose.Types.ObjectId(postId),
      });
      await likeModel.deleteMany({ postId: mongoose.Types.ObjectId(postId) });

      return res.json({
        status: true,
        message: `post deleted successfully`,
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

exports.buyStoreItem = async (req, res) => {
  const { userId, storeId } = req.body;

  const storeItemDetails = await storeModel.findOne({
    _id: mongoose.Types.ObjectId(storeId),
  });
  const userDetails = await userModel.findOne({
    _id: mongoose.Types.ObjectId(userId),
  });

  console.log("userDetails.coin =>", userDetails);
  console.log("storeItemDetails =>", storeItemDetails);

  if (!userDetails) {
    return res.json({
      status: false,
      message: "invalid user",
    });
  }

  if (!storeItemDetails) {
    return res.json({
      status: false,
      message: "invalid store item",
    });
  }

  if (userDetails.coin < storeItemDetails.price) {
    return res.json({
      status: false,
      message: "you don't have enough coins",
    });
  }

  function getCurrentDate() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  const currentDate = getCurrentDate();
  console.log("currentDate ===>", currentDate); // Output: "2023-06-19" (example)

  function addDaysToDate(dateString, days) {
    const date = new Date(dateString);
    date.setDate(date.getDate() + days);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  const updatedDate = addDaysToDate(currentDate, 10);
  console.log("updatedDate ===>", updatedDate); // Output: "2023-06-29"

  await userModel.findOneAndUpdate(
    { _id: mongoose.Types.ObjectId(userId) },
    { $set: { coin: userDetails.coin - storeItemDetails.price } }
  );

  new userStoreModel({
    userId: userId,
    storeId: storeId,
    validTill: updatedDate,
  })
    .save()
    .then(async (success) => {
      return res.json({
        status: true,
        message: `item purchased successfully`,
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

exports.isDeviceBanned = async (req, res) => {
  const { bannedDevice } = req.body;

  const isBannedDevice = await bannedDeviceModel.findOne({
    bannedDevice: bannedDevice,
  });

  if (isBannedDevice) {
    return res.json({ status: true, message: "this device is banned" });
  }

  if (!isBannedDevice) {
    return res.json({ status: false, message: "this device is not banned" });
  }
};

