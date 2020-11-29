const router = require('../../router')
const controller = require('../../../controllers/industry')
const auth = require('../../../middlewares/authentication')
const { routes } = require('../../../constant')

router.get(routes.industry.list, controller.getIndustryList);
router.get(routes.industry.licenseLevel, controller.getIndustryListWithLicenseLevel);

module.exports = router.expressRouter;