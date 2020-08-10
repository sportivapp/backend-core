const express = require('express');
const router = express.Router();
const controller = require('../../controllers/department')
const auth = require('../../middlewares/authentication');
const permission = require('../../middlewares/permission')

router.get('/department', auth.authenticateToken, permission.getPermission, controller.getAllDepartmentbyCompanyId);
router.post('/department', auth.authenticateToken, permission.getPermission, controller.createDepartment);
router.put('/department/:departmentId', auth.authenticateToken, permission.getPermission, controller.updateDepartment);
router.delete('/department/:departmentId', auth.authenticateToken, permission.getPermission, controller.deleteDepartment);

module.exports = router;