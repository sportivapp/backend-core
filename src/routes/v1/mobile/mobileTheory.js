const router = require('../../mobileRouter');
const controller = require('../../../controllers/mobileTheory');
const auth = require('../../../middlewares/authentication');

router.get('/theory', auth.authenticateToken, controller.getFilesByCompanyId);

module.exports = router.expressRouter;