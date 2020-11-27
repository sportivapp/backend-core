const router = require('../../mobileRouter');
const controller = require('../../../controllers/myForum');
const auth = require('../../../middlewares/authentication');

router.get('/my-thread', auth.authenticateToken, controller.getMyThreadList);

module.exports = router.expressRouter;