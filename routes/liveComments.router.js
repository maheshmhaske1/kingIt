var express = require("express");
var router = express.Router();
const livecomment = require("../controller/liveComment.controller");

router.post("/addComment", livecomment.addComment)
router.get("/getComments/:liveId", livecomment.getComments)

module.exports = router;
