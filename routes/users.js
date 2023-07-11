var express = require("express");
var router = express.Router();
const userController = require("../controller/user.controller");
const commentCOntroller = require("../controller/comment.controller");
const likeController = require("../controller/like.controller");
const { upload_profile, upload_post } = require("../middleware/upload");
const { authenticate_user } = require("../middleware/auth");

// /* GET users listing. */
router.get("/", (req, res, next) => {
  res.send("respond with a resource");
});

router.post("/create", userController.createUser);
router.post("/login", userController.login);
router.get("/get/:userId", userController.getUser);
router.delete("/delete/:userId", userController.deleteUser);
router.put("/update/:userId", userController.update);
router.post("/images/remove", userController.remove_profile_img);
router.get("/getAll", userController.getAll);
router.post("/send-gift", userController.sendGift);
router.post("/is-found", userController.isUserExist);
router.post("/reset-password", userController.resetPassword);
router.post("/send-otp/:mobile", userController.sendOtp);
router.post("/verify-otp/:mobile/:otp", userController.verifyOtp);
router.post(
  "/upload-profile/:user_id",
  upload_profile,
  userController.add_profile_image
);
router.post(
  "/upload-cover/:user_id",
  upload_profile,
  userController.add_cover_image
);

router.post("/post/add/:userId", upload_post, userController.addPost);
router.get("/post/get/:userId", userController.getUserPost);
router.get("/post/all", userController.getAllPost);
router.delete("/post/delete/:postId", userController.deletePost);

router.post("/post/comment/add", commentCOntroller.addComment);
router.put("/post/comment/update", commentCOntroller.updateComment);
router.delete("/post/comment/delete", commentCOntroller.deleteComment);

router.post("/post/like/add", likeController.addLike);
router.delete("/post/like/remove", likeController.deleteLike);
router.post("/store/purchase", userController.buyStoreItem);
router.put("/store/update", userController.updateUserStore);

router.post("/isBannedDevice", userController.isDeviceBanned);

module.exports = router;
