const express = require('express');
const router = express.Router();
const gradeController = require('../../controllers/grade')
const auth = require('../../middlewares/authentication');

router.get('/grades', auth.authenticateToken, gradeController.getGrades)
router.post('/grades', auth.authenticateToken, gradeController.createGrade)
router.get('/grades/:gradeId', auth.authenticateToken, gradeController.getGradeById)
router.put('/grades/:gradeId', auth.authenticateToken, gradeController.updateGradeById)
router.delete('/grades/:gradeId', auth.authenticateToken, gradeController.deleteGradeById)

module.exports = router