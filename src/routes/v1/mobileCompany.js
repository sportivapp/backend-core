const express = require('express');
const router = express.Router();
const controller = require('../../controllers/mobileCompany')
const auth = require('../../middlewares/authentication');

router.get('/company/:companyId', auth.authenticateToken, controller.getCompany);
router.get('/company', auth.authenticateToken, controller.getCompanies);
router.get('/virtual-member-company/:companyId', auth.authenticateToken, controller.getVirtualMemberCard);
router.post('/company-join', auth.authenticateToken, controller.joinCompany);
// user request join

module.exports = router;