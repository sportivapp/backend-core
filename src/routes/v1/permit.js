const express = require('express');
const router = express.Router();
const controller = require('../../controllers/permit')
const auth = require('../../middlewares/authentication');

router.post('/permit', auth.authenticateToken, controller.createPermit)
router.get('/permit', auth.authenticateToken, controller.getPermitList)
router.get('/permit/subordinate', auth.authenticateToken, controller.getSubordinatePermitList)
router.post('/permit/action', auth.authenticateToken, controller.updatePermitStatusById)
router.get('/permit/:permitId', auth.authenticateToken, controller.getPermitById)
router.put('/permit/:permitId', auth.authenticateToken, controller.updatePermitById)
router.delete('/permit/:permitId', auth.authenticateToken, controller.deletePermitById)
router.get('/permit/:permitId/request', auth.authenticateToken, controller.requestApproval)

module.exports = router