const { routes } = require('../../constant')
const router = require('../router');
const gradeController = require('../../controllers/grade')
const auth = require('../../middlewares/authentication');

router.get( routes.grade.grades, auth.authenticateToken, gradeController.getGrades)
router.post( routes.grade.grades, auth.authenticateToken, gradeController.createGrade)
router.get( routes.grade.id, auth.authenticateToken, gradeController.getGradeById)
router.put( routes.grade.id, auth.authenticateToken, gradeController.updateGradeById)
router.post( routes.grade.mapping, auth.authenticateToken, gradeController.saveUserPositions)
router.delete( routes.grade.id, auth.authenticateToken, gradeController.deleteGradeById)

module.exports = router.expressRouter