const { routes } = require('../../../constant')
const CreateClassRequest = require('./CreateClassRequest')
const UpdateClassRequest = require('./UpdateClassRequest')
const classSchemas = {}

classSchemas[routes.class.list] = CreateClassRequest
classSchemas[routes.class.id] = UpdateClassRequest

module.exports = classSchemas