const express = require('express');
const rechargecontroller = require('../controller/recharge.controller');

const router = express.Router();

router.post('/admin/recharge', rechargecontroller.createRecharge);

module.exports = router;
