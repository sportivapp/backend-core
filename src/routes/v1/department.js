const express = require('express');
const router = express.Router();
const controller = require('../../controllers/department')
const auth = require('../../middlewares/authentication');

router.get('/department/:companyId', auth.authenticateToken, controller.getAllDepartmentbyCompanyId);
router.post('/department', auth.authenticateToken, controller.createDepartment);
router.put('/department/:departmentId', auth.authenticateToken, controller.updateDepartment);
router.delete('/department/:departmentId', auth.authenticateToken, controller.deleteDepartment);

module.exports = router;