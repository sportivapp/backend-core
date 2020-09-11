const router = require('../router')
const theoryController = require('../../controllers/theory');
const auth = require('../../middlewares/authentication');

router.get('/theory', auth.authenticateToken, theoryController.getTheoryList);

module.exports = router.expressRouter;
