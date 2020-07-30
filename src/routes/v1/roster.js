const express = require('express');
const router = express.Router();
const { Create, List, ListMember, View, Update, Delete, GenerateShift } = require('../../controllers/roster');
const auth = require('../../middlewares/authentication');

router.post('/roster', auth.authenticateToken, Create);
router.get('/roster-members', auth.authenticateToken, ListMember);
router.get('/roster-list', auth.authenticateToken, List);
router.get('/roster', auth.authenticateToken, View)
router.put('/roster', auth.authenticateToken, Update)
router.delete('/roster', auth.authenticateToken, Delete);
router.post('/roster-shift', auth.authenticateToken, GenerateShift);

module.exports = router;