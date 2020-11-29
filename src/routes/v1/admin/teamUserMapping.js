const express = require('express');
const router = express.Router();
const controller = require('../../../controllers/teamUserMapping')
const auth = require('../../../middlewares/authentication');
const { routes } = require('../../../constant');

router.get( routes.team.isAdmin, auth.authenticateToken, controller.isAdmin);

module.exports = router;