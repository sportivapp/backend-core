const router = require('../router')
const countryController = require('../../../controllers/country')
const { routes } = require('../../../constant')

router.get( routes.country.list, countryController.getAllCountries);

module.exports = router.expressRouter;
