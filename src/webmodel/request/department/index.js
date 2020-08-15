const { routes } = require('../../../constant')
const CreateDepartmentRequest = require('./CreateDepartmentRequest')
const UpdateDepartmentRequest = require('./UpdateDepartmentRequest')

const departmentSchemas = {}

departmentSchemas[routes.department.department] = CreateDepartmentRequest
departmentSchemas[routes.department.id] = UpdateDepartmentRequest

module.exports = departmentSchemas