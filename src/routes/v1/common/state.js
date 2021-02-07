const router = require('../router')
const stateController = require('../../../controllers/state')
const { routes } = require('../../../constant')

router.get( routes.state.list, stateController.getAllStates);

module.exports = router.expressRouter;
