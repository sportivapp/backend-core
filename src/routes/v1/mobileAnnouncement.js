const express = require('express');
const router = express.Router();
const controller = require('../../controllers/mobileAnnouncement');
const auth = require('../../middlewares/authentication');

router.get('/announcement', auth.authenticateToken, controller.getAnnouncement);

module.exports = router;