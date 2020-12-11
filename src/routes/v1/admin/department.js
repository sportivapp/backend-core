const router = require('../../router')
const controller = require('../../../controllers/department')
const auth = require('../../../middlewares/authentication');
const { routes } = require('../../../constant')

router.get( routes.department.list, auth.authenticateToken, controller.getAllDepartmentbyCompanyId);
router.get( routes.department.id, auth.authenticateToken, controller.getDepartmentByDepartmentId);
router.post( routes.department.list, auth.authenticateToken, controller.createDepartment);
router.put( routes.department.id, auth.authenticateToken, controller.updateDepartment);
router.delete( routes.department.id, auth.authenticateToken, controller.deleteDepartment);
router.get( routes.department.users, auth.authenticateToken, controller.getAllUsersByDepartmentId);

module.exports = router.expressRouter;