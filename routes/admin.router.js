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
router.get(
  "/getAllDeviceInBlockList",
  authenticate_admin,
  admin.getAllBannedDevice
);
router.delete(
  "/deleteDeviceInBlockList",
  authenticate_admin,
  admin.deleteFromBannedDevice
);


router.get("/getRechargeHistory", authenticate_admin, admin.getRechargeHistory);
router.post("/add-store", upload_store, admin.addItemStore);
router.put("/update-store", upload_store, admin.updateStore);
router.post("/delete-store", admin.deleteStore);
router.post("/add-levels", upload_store, admin.addLevelMaster);
router.put("/update-levels", upload_store, admin.updateLevelMaster);
router.get("/getAll-levels", admin.getAllLevel);
router.post("/delete-levels", upload_store, admin.deleteLevelMaster);
router.get("/get-all-store", admin.getAllStores);
router.post("/add-sticker", upload_store, admin.addSticker);
router.get("/sticker/getall", admin.getAllSticker);
router.post("/sticker/delete", admin.deleteSticker);
router.put("/sticker/update/:stickerId", upload_store, admin.updateSticker);
router.post('/addAd', admin.addAd)
router.post('/ad/get/:status', admin.getAds)
router.delete('/ad/delete/:adId', admin.deleteAd)
router.put('/ad/update', admin.updateAd)
router.get('/user/getByCountry', admin.getUserByCountry)
router.get('/user/getBannedUsers', admin.getBanUser)
router.get('/user/unban/:id', admin.unbanUser)



//Salary 
router.post('/salary', admin.createSalary); // NOT IN USE
router.post('/clear-salary', admin.clearUserSalary)
router.get('/get-salary-history', admin.getSalaryHistory)


// API routes for gifts
router.post('/gifts/add', upload_store, admin.createGift);
router.get('/gifts/getAll', upload_store, admin.getAllGifts);
router.put('/gifts/update/:giftId', upload_store, admin.updateGift);
router.delete('/gifts/delete/:giftId', admin.deleteGift);


//Banner
router.post('/banner/add', upload_store, admin.createBanner);
router.get('/banner/getAll', admin.getAllBanners);
router.put('/banner/update/:bannerId', upload_store, admin.updateBanner);
router.delete('/banner/delete/:bannerId', admin.deleteBanner);

module.exports = router;
