const router = require('../router')
const controller = require('../../controllers/newsUser')
const auth = require('../../middlewares/authentication');
const { routes } = require('../../constant')

router.post( routes.newsUser.like, auth.authenticateToken, controller.likeNews);
router.get( routes.newsUser.generate, auth.authenticateToken, controller.generateNewsLink);
router.get( routes.newsUser.list, auth.authenticateToken, controller.getNews);
router.get( routes.newsUser.id, auth.authenticateToken, controller.getNewsDetail);
router.get( routes.newsUser.count, auth.authenticateToken, controller.getUserViewCount);
router.delete( routes.newsUser.like, auth.authenticateToken, controller.removeLikeNews);

module.exports = router.expressRouter;