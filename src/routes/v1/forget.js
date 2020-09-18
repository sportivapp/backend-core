const router = require('../router')
const controller = require('../../controllers/forget');

router.post('/forget-email', controller.sendForgetEmail);

module.exports = router.expressRouter;