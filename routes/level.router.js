var express = require("express");
var router = express.Router();
const level = require("../controller/level.controller");

router.post("/add", level.addLevel);
router.get("/getAll", level.getAll);
router.delete("/delete/:levelId", level.delete);

module.exports = router;
