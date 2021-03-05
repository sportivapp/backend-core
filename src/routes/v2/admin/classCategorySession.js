const router = require('../router');
const auth = require('../../../middlewares/authentication');
const { routes } = require('../../../constant');
const controller = require('../../../controllers/v2/classCategorySession');

router.get(routes.classCategorySession.participants, auth.authenticateToken, controller.getSessionParticipants);
router.get(routes.classCategorySession.list, auth.authenticateToken, controller.getSessions);

module.exports = router.expressRouter;