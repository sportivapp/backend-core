const { routes } = require('../../../constant')
const CreatePermitRequest = require('./CreatePermitRequest')
const UpdatePermitRequest = require('./UpdatePermitRequest')
const UpdatePermitStatusRequest = require('./UpdatePermitStatusRequest')

const permitSchemas = {}

permitSchemas[routes.permit.list] = CreatePermitRequest
permitSchemas[routes.permit.id] = UpdatePermitRequest
permitSchemas[routes.permit.action] = UpdatePermitStatusRequest

module.exports = permitSchemas