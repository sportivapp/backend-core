const router = require('../router')
const companyController = require('../../controllers/company');
const auth = require('../../middlewares/authentication');
const { routes } = require('../../constant');

router.post(routes.company.list, auth.authenticateToken, companyController.create);
router.post(routes.company.users, auth.authenticateToken, companyController.saveUsersToCompany)
router.get(routes.company.users, auth.authenticateToken, companyController.getUsersByCompanyId)

module.exports = router.expressRouter