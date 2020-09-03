const router = require('../router');
const approvalController = require('../../controllers/approval')
const auth = require('../../middlewares/authentication')
const { routes } = require('../../constant')

router.post( routes.approval.find, auth.authenticateToken, approvalController.getApprovalByCompanyIdAndDepartmentIdAndUserId);
router.put( routes.approval.find, auth.authenticateToken, approvalController.updateApprovalByCompanyIdAndDepartmentIdAndUserId);
router.post( routes.approval.list, auth.authenticateToken, approvalController.createApproval);
router.post( routes.approval.id, auth.authenticateToken, approvalController.addUserByApprovalId);
router.delete( routes.approval.user, auth.authenticateToken, approvalController.deleteUserByApprovalId);

module.exports = router.expressRouter;