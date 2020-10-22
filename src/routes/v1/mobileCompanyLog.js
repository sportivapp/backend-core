const express = require('express');
const router = express.Router();
const controller = require('../../controllers/mobileCompanyLog')
const auth = require('../../middlewares/authentication');
const { routes } = require('../../constant')

router.get(routes.companyLog.listPending, auth.authenticateToken, controller.getUserCompanyPendingListByLogType)

module.exports = router;