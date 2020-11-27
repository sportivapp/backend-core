const express = require('express');
const router = express.Router();
const controller = require('../../../controllers/sportTypeRole')
const auth = require('../../../middlewares/authentication');
const { routes } = require('../../../constant');

router.get( routes.sportTypeRole.industry, auth.authenticateToken, controller.getSportTypeRoleListByIndustryId);

module.exports = router;