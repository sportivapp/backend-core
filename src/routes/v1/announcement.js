const express = require('express');
const router = express.Router();
const { Create, List, View, Update, Delete } = require('../../controllers/announcement')
const auth = require('../../middlewares/authentication');

router.post('/announcement', auth.authenticateToken, Create);
router.get('/announcement/:announcementId', auth.authenticateToken, View);
router.get('/announcement-list', auth.authenticateToken, List);
router.put('/announcement/:announcementId', auth.authenticateToken, Update);
router.put('/announcement-delete/:announcementId', auth.authenticateToken, Delete);

module.exports = router;