const express = require('express');
const router = express.Router();
const controller = require('../../controllers/team')
const auth = require('../../middlewares/authentication');
const { routes } = require('../../constant')

router.get( routes.team.list, auth.authenticateToken, controller.getTeamsByCompanyId);

module.exports = router;