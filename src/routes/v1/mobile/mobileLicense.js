const router = require('../mobileRouter');
const controller = require('../../../controllers/mobileLicense')
const auth = require('../../../middlewares/authentication');

router.get('/license/:licenseId', auth.authenticateToken, controller.getLicense);
router.get('/license', auth.authenticateToken, controller.getLicenses);
router.post('/license', auth.authenticateToken, controller.createLicense);
router.put('/license/:licenseId', auth.authenticateToken, controller.updateLicense);
router.delete('/license', auth.authenticateToken, controller.deleteLicenses);

module.exports = router.expressRouter;