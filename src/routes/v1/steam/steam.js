const router = require('../router');
const steamController = require('../../../controllers/steam');
const { routes } = require('../../../constant');

router.get(routes.steam.redirect, steamController.redirect);
router.get(routes.steam.authenticate, steamController.authenticate);

module.exports = router.expressRouter;