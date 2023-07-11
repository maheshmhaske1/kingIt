const express = require("express");
const router = express.Router();
const { authenticate_admin } = require("../middleware/auth");

const admin = require("../controller/admin.controller");
const { upload_store } = require("../middleware/upload");

router.post("/login", admin.adminLogin);
router.post("/add", admin.addAdmin);
router.get("/getAllUser", authenticate_admin, admin.getAllUsers);
router.post("/blockUser", authenticate_admin, admin.updateUser);
router.post("/recharge", authenticate_admin, admin.recharge);
router.post(
  "/addDeviceInBlockList",
  authenticate_admin,
  admin.addDeviceIntoBlock
);
router.get("/getRechargeHistory", authenticate_admin, admin.getRechargeHistory);
router.post("/add-store", upload_store, admin.addItemStore);
router.post("/add-levels", upload_store, admin.addLevelMaster);
router.post("/delete-levels", upload_store, admin.deleteLevelMaster);
router.get("/get-all-store", admin.getAllStores);
router.post("/add-sticker", upload_store, admin.addSticker);
router.get("/sticker/getall", admin.getAllSticker);
router.put("/sticker/update/:stickerId", admin.updateSticker);
router.post('/addAd', admin.addAd)
router.post('/ad/get/:status', admin.getAds)
router.delete('/ad/delete/:adId', admin.deleteAd)
router.put('/ad/update', admin.updateAd)
router.get('/user/getByCountry', admin.getUserByCountry)
router.get('/user/getBannedUsers', admin.getBanUser)



//Salary 
router.post('/salary', admin.createSalary);


// API routes for gifts
router.post('/ad/gifts', admin.createGift);


//Banner
router.post('/banner', admin.createBanner);

module.exports = router;
