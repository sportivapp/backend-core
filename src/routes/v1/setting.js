const express = require('express');
const router = express.Router();
const controller = require('../../controllers/setting');
const auth = require('../../middlewares/authentication');

router.get('/setting/module', auth.authenticateToken, controller.getModulesByCompanyId);
router.put('/setting/module/:moduleId', auth.authenticateToken, controller.updateModulesNameByCompanyId);

router.get('/setting/function/:gradeId', auth.authenticateToken, controller.getAllFunctionByGradeId);
router.post('/setting/function/:gradeId', auth.authenticateToken, controller.saveFunctionsByGradeId)

module.exports = router;