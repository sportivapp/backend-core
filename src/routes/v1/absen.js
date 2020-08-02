const express = require('express');
const router = express.Router();
const { Create, List, ListById, Update, Delete } = require('../../controllers/absen')
const auth = require('../../middlewares/authentication');

router.post('/absen', Create);
router.get('/absen-list/:userId', ListById);
router.get('/absen-list', List);
router.put('/absen/:absenId', auth.authenticateToken, Update);
router.put('/absen-delete/:absenId', auth.authenticateToken, Delete);

module.exports = router;