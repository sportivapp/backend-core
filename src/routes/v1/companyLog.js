const router = require('../router')
const companyLogController = require('../../controllers/companyLog');
const auth = require('../../middlewares/authentication');
const { routes } = require('../../constant');

router.post(routes.companyLog.list, auth.authenticateToken, companyLogController.inviteMember)
router.get(routes.companyLog.list, auth.authenticateToken, companyLogController.getLogList)
router.get(routes.companyLog.listPending, auth.authenticateToken, companyLogController.getUserCompanyPendingListByLogType)
router.put(routes.companyLog.processRequest, auth.authenticateToken, companyLogController.processRequests)
router.delete(routes.companyLog.cancelInvite, auth.authenticateToken, companyLogController.cancelInvites)

module.exports = router.expressRouter