const router = require('../router')
const controller = require('../../controllers/experience');
const auth = require('../../middlewares/authentication');
const { routes } = require('../../constant')

router.get(routes.experience.id, auth.authenticateToken, controller.getExperienceById);

module.exports = router.expressRouter;