const express = require('express');
const router = express.Router();
const { Create, List, ListById, Update, Delete } = require('../../controllers/absen')
const auth = require('../../middlewares/authentication');

router.post('/absen', auth.authenticateToken, Create);
router.get('/absen-list/:userId', auth.authenticateToken, ListById);
router.get('/absen-list', auth.authenticateToken, List);
router.put('/absen/:absenId', auth.authenticateToken, Update);
router.put('/absen-delete/:absenId', auth.authenticateToken, Delete);

module.exports = router;