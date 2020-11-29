const router = require('../../router');
const reportThreadController = require('../../../controllers/reportThread');
const auth = require('../../../middlewares/authentication');
const { routes } = require('../../../constant')

router.post(routes.report.thread, auth.authenticateToken, reportThreadController.createReportThread);
router.get(routes.report.threadType, auth.authenticateToken, reportThreadController.getReportTypes);

module.exports = router.expressRouter;