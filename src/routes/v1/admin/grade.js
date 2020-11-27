const { routes } = require('../../../constant')
const router = require('../../router');
const gradeController = require('../../../controllers/grade')
const auth = require('../../../middlewares/authentication');

router.get( routes.grade.list, auth.authenticateToken, gradeController.getGrades)
router.post( routes.grade.list, auth.authenticateToken, gradeController.createGrade)
router.get( routes.grade.id, auth.authenticateToken, gradeController.getGradeById)
router.put( routes.grade.id, auth.authenticateToken, gradeController.updateGradeById)
router.post( routes.grade.mapping, auth.authenticateToken, gradeController.saveUserPositions)
router.delete( routes.grade.id, auth.authenticateToken, gradeController.deleteGradeById)
router.get( routes.grade.users, auth.authenticateToken, gradeController.getUsersByPositionId)

module.exports = router.expressRouter