const router = require('../../router')
const controller = require('../../../controllers/forget');

router.post('/forget-email', controller.sendForgetEmail);
router.get('/forget-check/:token/:email', controller.checkForgetLink);
router.post('/forget-set-password/:token/:email', controller.setPassword);

module.exports = router.expressRouter;