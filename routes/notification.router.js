const express = require('express')
const router = express.Router()

const notification = require('../controller/notification.controller')

router.post('/add', notification.createNotification)
router.post('/get', notification.getNotification)
router.post('/mark-read', notification.markNotificationAsRead)
router.post('/mark-all-read', notification.markAllNotificationAsRead)

module.exports = router
