const router = require('../../mobileRouter');
const controller = require('../../../controllers/mobileCompany')
const auth = require('../../../middlewares/authentication');
const { routes } = require('../../../constant')

router.get('/company/:companyId', auth.authenticateToken, controller.getCompany);
router.get('/company', auth.authenticateToken, controller.getAllCompanies);
router.get('/my-company', auth.authenticateToken, controller.getMyCompanies);
router.get('/virtual-member-company/:companyId', auth.authenticateToken, controller.getVirtualMemberCard);
router.get(routes.company.users, auth.authenticateToken, controller.getUsersByCompanyId)
router.post('/company-join', auth.authenticateToken, controller.joinCompany);
router.post( routes.company.exit, auth.authenticateToken, controller.exitCompany);
router.post( routes.company.processInvitation, auth.authenticateToken, controller.processInvitation);
router.delete( routes.company.cancelJoin, auth.authenticateToken, controller.userCancelJoins);
// user request join

module.exports = router.expressRouter;