const router = require('../../landingRouter.js');
const controller = require('../../../controllers/landing/companyUser')
const auth = require('../../../middlewares/authentication');

router.get('/user/companies/summary', auth.authenticateToken, controller.getUserCompanySummary);
router.get('/user/companies', auth.authenticateToken, controller.getMyCompanies);
router.get('/user/companies/applies', auth.authenticateToken, controller.getRequestedCompanies);
router.get('/user/companies/invites', auth.authenticateToken, controller.getCompanyInvites);
router.delete( '/user/companies/:companyId/exit', auth.authenticateToken, controller.exitCompany);

module.exports = router.expressRouter