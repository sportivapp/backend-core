const express = require('express');
const router = express.Router();
const { Create, List, ListMember, View, Update, Delete, GenerateShift } = require('../../controllers/roster');
const auth = require('../../middlewares/authentication');

router.post('/roster', auth.authenticateToken, Create);
router.get('/roster-members/:rosterId', auth.authenticateToken, ListMember);
router.get('/roster', auth.authenticateToken, List);
router.get('/roster/:rosterId', auth.authenticateToken, View)
router.put('/roster/:rosterId', auth.authenticateToken, Update)
router.delete('/roster/:rosterId', auth.authenticateToken, Delete);
router.post('/roster-shift', auth.authenticateToken, GenerateShift);

module.exports = router;