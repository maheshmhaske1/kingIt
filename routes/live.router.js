var express = require("express");
var router = express.Router();
const live = require("../controller/live.controller");

router.post("/add", live.goLive); //
router.get("/get", live.getLives);
router.get("/getbycountry/:country", live.getLiveByCountry);
router.get('/get/:liveId', live.getLiveById)
router.post("/block/user", live.addUserInBlockList);
router.delete("/end/:liveId", live.endLive);
router.post("/watch", live.watchLive); //
router.delete("/stopWatching", live.stopWatchingLive); //
router.post("/request-join", live.requestToJoinWithLive); //
router.put("/request-update", live.updateLiveJoinRequest); //
router.get("/get-pending-request/:liveId", live.getPendingRequests); //
router.get("/get-accepted-request/:liveId", live.getAcceptedRequests); //
router.post("/kick-user", live.kickFromLive); //
router.post("/send-coin", live.sendCoin); //
router.get('/live-all-earning-history', live.getLiveEarningHistory)
router.post('/live-all-earning-history-byUser', live.getLiveEarningHistoryByUser)
router.get('/live-earning-history/:liveId', live.getLiveEarningHistorybylive)
router.post('/mute_user', live.muteUser)
router.post('/kick_user', live.kickUser)
router.post('/unkick_user', live.removekickUser)
router.get('/getkickedUsers/:hostId', live.getkickedUser)
router.post('/makeAdmin', live.liveUserUpdate)
router.get('/getTopSender', live.getTopSender)
router.get('/getTopSenderByCountry/:country', live.getTopSenderByCountry)
router.get('/getTopReciverByCountry/:country', live.getTopReciverByCountry)
router.get('/getTopReciver', live.getTopReciver)
router.get('/gettopsendrecive', live.getGiftSendHistory)

router.get('/test', live.test)

module.exports = router;
