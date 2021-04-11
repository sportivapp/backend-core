const router = require('../commonRouter');
const auth = require('../../../middlewares/authentication');
const { routes } = require('../../../constant');
const controller = require('../../../controllers/v2/commonClassCategorySession');

router.post(routes.classCategorySession.generate, auth.authenticateToken, controller.generateSessionsByCity);

module.exports = router.expressRouter;