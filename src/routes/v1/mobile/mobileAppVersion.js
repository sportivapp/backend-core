const router = require('../mobileRouter');
const controller = require('../../../controllers/mobileAppVersion')
const { routes } = require('../../../constant')

router.get( routes.app.version, controller.getVersion);

module.exports = router.expressRouter;