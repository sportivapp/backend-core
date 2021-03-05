const router = require('../../v2/router');
const auth = require('../../../middlewares/authentication');
const { routes } = require('../../../constant');
const controller = require('../../../controllers/permission');

router.get(routes.permissionV2.moduleName, auth.authenticateToken, controller.getPermissionsByModuleName);

module.exports = router.expressRouter;