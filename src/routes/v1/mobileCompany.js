const express = require('express');
const router = express.Router();
const controller = require('../../controllers/mobileCompany')
const auth = require('../../middlewares/authentication');
const { routes } = require('../../constant')

router.get('/company/:companyId', auth.authenticateToken, controller.getCompany);
router.get( routes.company.pending, auth.authenticateToken, controller.getListPendingInviteByUserId);
router.get('/company', auth.authenticateToken, controller.getCompanies);
router.get('/virtual-member-company/:companyId', auth.authenticateToken, controller.getVirtualMemberCard);
router.post('/company-join', auth.authenticateToken, controller.joinCompany);
router.post( routes.company.exit, auth.authenticateToken, controller.exitCompany);
router.post( routes.company.processInvitation, auth.authenticateToken, controller.processInvitation);
router.delete( routes.company.cancelJoin, auth.authenticateToken, controller.userCancelJoin);
// user request join

module.exports = router;