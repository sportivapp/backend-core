const router = require('../router');
const reportThreadController = require('../../controllers/reportThread');
const auth = require('../../middlewares/authentication');
const { routes } = require('../../constant')

router.post(routes.report.thread, auth.authenticateToken, reportThreadController.createReportThread);

module.exports = router.expressRouter;