const express = require('express');
const router = express.Router();
const companyController = require('../../controllers/company');
const auth = require('../../middlewares/authentication');

router.post('/company', auth.authenticateToken, companyController.create);
router.post('/company/:companyId/users', auth.authenticateToken, companyController.saveUsersToCompany)
router.get('/company/:companyId/users', auth.authenticateToken, companyController.getUsersByCompanyId)

module.exports = router;