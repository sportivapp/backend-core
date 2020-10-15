const router = require('../router')
const companyController = require('../../controllers/company');
const auth = require('../../middlewares/authentication');
const { routes } = require('../../constant');

router.post(routes.company.register, companyController.registerCompany)
router.post(routes.company.list, auth.authenticateToken, companyController.createCompany)
router.get(routes.company.id, auth.authenticateToken, companyController.getCompanyById)
router.put(routes.company.id, auth.authenticateToken, companyController.editCompany)
router.delete(routes.company.id, auth.authenticateToken, companyController.deleteCompany)
router.get(routes.company.list, auth.authenticateToken, companyController.getAllCompanyList)
router.get(routes.company.myList, auth.authenticateToken, companyController.getMyCompanyList)
router.post(routes.company.users, auth.authenticateToken, companyController.saveUsersToCompany)
router.get(routes.company.users, auth.authenticateToken, companyController.getUsersByCompanyId)

module.exports = router.expressRouter