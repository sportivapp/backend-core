const router = require('../mobileRouter');
const controller = require('../../../controllers/newsUser')
const auth = require('../../../middlewares/authentication');
const { routes } = require('../../../constant')

router.get( routes.news.like, auth.authenticateToken, controller.likeNews);
router.get( routes.news.generate, auth.authenticateToken, controller.generateNewsLink);
router.get( routes.news.list, auth.authenticateToken, controller.getNews);
router.get( routes.news.id, auth.authenticateToken, controller.getNewsDetail);
router.get( routes.news.count, auth.authenticateToken, controller.getUserViewCount);
router.delete( routes.news.like, auth.authenticateToken, controller.removeLikeNews);

module.exports = router.expressRouter;