const router = require('../router')
const companyController = require('../../controllers/company');
const auth = require('../../middlewares/authentication');
const { routes } = require('../../constant');

router.post('/company-register', companyController.registerCompany);
router.post(routes.company.list, auth.authenticateToken, companyController.createCompany);
router.put('/company/:companyId', auth.authenticateToken, companyController.editCompany)
router.delete('/company/:companyId', auth.authenticateToken, companyController.deleteCompany)
router.get(routes.company.list, auth.authenticateToken, companyController.getCompany)
router.get('/company/user', auth.authenticateToken, companyController.getAllCompanyByUserId)
router.post(routes.company.users, auth.authenticateToken, companyController.saveUsersToCompany)
router.get(routes.company.users, auth.authenticateToken, companyController.getUsersByCompanyId)

module.exports = router.expressRouter