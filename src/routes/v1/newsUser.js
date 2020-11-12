const router = require('../router')
const controller = require('../../controllers/newsUser')
const auth = require('../../middlewares/authentication');
const { routes } = require('../../constant')

router.get( routes.newsUser.like, auth.authenticateTokenIfExist, controller.likeNews);
router.get( routes.newsUser.generate, auth.authenticateTokenIfExist, controller.generateNewsLink);
router.get( routes.newsUser.list, auth.authenticateTokenIfExist, controller.getNews);
router.get( routes.newsUser.id, auth.authenticateTokenIfExist, controller.getNewsDetail);
router.get( routes.newsUser.count, auth.authenticateTokenIfExist, controller.getUserViewCount);
router.delete( routes.newsUser.like, auth.authenticateTokenIfExist, controller.removeLikeNews);

module.exports = router.expressRouter;