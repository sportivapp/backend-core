const router = require('../../landingRouter');
const controller = require('../../../controllers/landing/company')
const auth = require('../../../middlewares/authentication');

router.get('/companies', auth.authenticateTokenIfExist, controller.getAllCompanies);
router.get('/companies', auth.authenticateToken, controller.createCompany);
router.get('/companies/:companyId', auth.authenticateToken, controller.getCompany);
router.get('/companies/:companyId/users', auth.authenticateToken, controller.getUsersByCompanyId);

module.exports = router.expressRouter;