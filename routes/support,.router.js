var express = require('express');
var router = express.Router();
const userSupport = require('../controller/support.controller')


router.post('/add', userSupport.addUserSupport)
router.get('/getAll', userSupport.getAll)

module.exports = router;
