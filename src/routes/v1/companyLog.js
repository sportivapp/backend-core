const router = require('../router')
const companyLogController = require('../../controllers/companyLog');
const auth = require('../../middlewares/authentication');
const { routes } = require('../../constant');

router.post(routes.companyLog.list, auth.authenticateToken, companyLogController.inviteMember)
router.get(routes.companyLog.list, auth.authenticateToken, companyLogController.getLogList)
router.put(routes.companyLog.id, auth.authenticateToken, companyLogController.processRequest)
router.delete(routes.companyLog.id, auth.authenticateToken, companyLogController.cancelInvite)

module.exports = router.expressRouter