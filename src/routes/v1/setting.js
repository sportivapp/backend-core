const express = require('express');
const router = express.Router();
const controller = require('../../controllers/setting');
const auth = require('../../middlewares/authentication');

router.get('/setting/company-module/:companyId', controller.getModulesByCompanyId);
router.put('/setting/company-module/:companyId', auth.authenticateToken, controller.updateModulesNameByCompanyId);

module.exports = router;