const router = require('../landingRouter')
const controller = require('../../../controllers/otp');

router.post('/otp-email', controller.createOtp);

module.exports = router.expressRouter;