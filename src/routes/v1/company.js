const express = require('express');
const router = express.Router();
const companyController = require('../../controllers/company');
const auth = require('../../middlewares/authentication');

router.post('/company-register', companyController.registerCompany);
router.post('/company', auth.authenticateToken, companyController.createCompany);
router.post('/company/:companyId/users', auth.authenticateToken, companyController.saveUsersToCompany)
router.put('/company/:companyId', auth.authenticateToken, companyController.editCompany)
router.delete('/company/:companyId', auth.authenticateToken, companyController.deleteCompany)
router.get('/company/:companyId/users', auth.authenticateToken, companyController.getUsersByCompanyId)
router.get('/company', auth.authenticateToken, companyController.getCompany)

module.exports = router;