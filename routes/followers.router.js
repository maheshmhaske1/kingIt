const express = require("express");
const router = express.Router();

const followers = require("../controller/followers.controller");

router.post("/add", followers.follow_user);
router.post("/remove", followers.unFollow_user);
router.get("/get-followers/:user_id", followers.get_user_followers);
router.get("/get-following/:user_id", followers.get_user_following);

module.exports = router;
