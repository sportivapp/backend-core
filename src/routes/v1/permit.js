const express = require('express');
const router = express.Router();
const { Create, List, SubordinatePermitList, RequestApproval, GetById, UpdateById, UpdateStatusById, DeleteById } = require('../../controllers/permit')
const auth = require('../../middlewares/authentication');

router.post('/permit', auth.authenticateToken, Create)
router.get('/permit', auth.authenticateToken, List)
router.get('/permit/subordinate', auth.authenticateToken, SubordinatePermitList)
router.post('/permit/action', auth.authenticateToken, UpdateStatusById)
router.get('/permit/:permitId', auth.authenticateToken, GetById)
router.put('/permit/:permitId', auth.authenticateToken, UpdateById)
router.delete('/permit/:permitId', auth.authenticateToken, DeleteById)
router.get('/permit/:permitId/request', auth.authenticateToken, RequestApproval)

module.exports = router