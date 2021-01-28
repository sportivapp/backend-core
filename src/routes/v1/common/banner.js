const router = require('../../router')
const bannerController = require('../../../controllers/banner')
const { routes } = require('../../../constant')
const auth = require('../../../middlewares/authentication');

router.post(routes.banner.list, auth.authenticateToken, bannerController.insertBanner);
router.get(routes.banner.list, bannerController.getBanners);

module.exports = router.expressRouter;