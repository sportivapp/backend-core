const router = require('../landingRouter.js');
const controller = require('../../../controllers/landing/companyLog')
const auth = require('../../../middlewares/authentication');

router.post('/companies/join', auth.authenticateToken, controller.joinCompany);
router.post('/user/companies/log/process', auth.authenticateToken, controller.processInvitations);
router.delete('/user/companies/log/cancel', auth.authenticateToken, controller.userCancelJoins);

module.exports = router.expressRouter