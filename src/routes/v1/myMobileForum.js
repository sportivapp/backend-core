const router = require('../mobileRouter');
const controller = require('../../controllers/myForum');
const auth = require('../../middlewares/authentication');
const { routes } = require('../../constant') //TODO: being used later, to avoid constant conflict

router.get('/my-thread', auth.authenticateToken, controller.getMyThreadList);

module.exports = router.expressRouter;