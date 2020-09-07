const { routes } = require('../../../constant')
const CreateGradeRequest = require('./CreateGradeRequest')
const UpdateGradeRequest = require('./UpdateGradeRequest')
const UserPositionRequest = require('./UserPositionRequest')

const gradeSchemas = {}

gradeSchemas[routes.grade.grades] = CreateGradeRequest
gradeSchemas[routes.grade.id] = UpdateGradeRequest
gradeSchemas[routes.grade.mapping] = UserPositionRequest

module.exports = gradeSchemas