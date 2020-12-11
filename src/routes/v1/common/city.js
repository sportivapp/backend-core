const router = require('../../router')
const cityController = require('../../../controllers/city')
const { routes } = require('../../../constant')

router.get( routes.city.list, cityController.getAllCitiesByCountryId);

module.exports = router.expressRouter;