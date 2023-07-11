var express = require('express');
var router = express.Router();
const userfeedback = require('../controller/feedback.controller')


router.post('/add', userfeedback.addfeedback)
router.get('/getAll', userfeedback.getAll)

module.exports = router;
