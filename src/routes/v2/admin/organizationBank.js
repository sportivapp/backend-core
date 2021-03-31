const router = require('../router');
const controller = require('../../../controllers/v2/organizationBank')
const auth = require('../../../middlewares/authentication');
const { routes } = require('../../../constant');

router.post(routes.organizationBank.list, auth.authenticateToken, controller.createCompanyBank);
router.get(routes.organizationBank.list, auth.authenticateToken, controller.getAllCompanyBanks);
router.put(routes.organizationBank.main, auth.authenticateToken, controller.updateCompanyBankToMain);
router.delete(routes.organizationBank.id, auth.authenticateToken, controller.softDeleteCompanyBank);

module.exports = router.expressRouter;