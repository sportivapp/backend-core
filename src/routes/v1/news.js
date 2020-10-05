const express = require('express');
const router = express.Router();
const controller = require('../../controllers/news')
const auth = require('../../middlewares/authentication');
const { routes } = require('../../constant')

router.post( routes.news.list, auth.authenticateToken, controller.createNews);
router.put( routes.news.publish, auth.authenticateToken, controller.publishNews);
router.put( routes.news.id, auth.authenticateToken, controller.editNews);
router.get( routes.news.generate, auth.authenticateToken, controller.generateNewsLink);
router.get( routes.news.list, auth.authenticateToken, controller.getNews);
router.get( routes.news.id, auth.authenticateToken, controller.getNewsDetail);
router.get( routes.news.count, auth.authenticateToken, controller.getUserViewCount);
router.delete( routes.news.id, auth.authenticateToken, controller.deleteNews);

module.exports = router;