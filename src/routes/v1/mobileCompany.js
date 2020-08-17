const express = require('express');
const router = express.Router();
const controller = require('../../controllers/mobileCompany')
const auth = require('../../middlewares/authentication');

router.get('/company/:companyId', auth.authenticateToken, controller.getCompany);
router.get('/company', auth.authenticateToken, controller.getCompanies);

module.exports = router;