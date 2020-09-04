const express = require('express');
const router = express.Router();
const controller = require('../../controllers/permit')
const auth = require('../../middlewares/authentication');
const { routes } = require('../../constant');

router.post(routes.permit.list, auth.authenticateToken, controller.createPermit)
router.get(routes.permit.list, auth.authenticateToken, controller.getPermitList)
router.get(routes.permit.subordinate, auth.authenticateToken, controller.getSubordinatePermitList)
router.post(routes.permit.action, auth.authenticateToken, controller.updatePermitStatusById)
router.get(routes.permit.id, auth.authenticateToken, controller.getPermitById)
router.put(routes.permit.id, auth.authenticateToken, controller.updatePermitById)
router.delete(routes.permit.id, auth.authenticateToken, controller.deletePermitById)
router.get(routes.permit.request, auth.authenticateToken, controller.requestApproval)

module.exports = router