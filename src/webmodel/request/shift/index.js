const { routes } = require('../../../constant')
const CreateShiftRequest = require('./CreateShiftRequest')
const UpdateShiftRequest = require('./UpdateShiftRequest')

const shiftSchemas = {}

shiftSchemas[routes.shift.list] = CreateShiftRequest
shiftSchemas[routes.shift.id] = UpdateShiftRequest

module.exports = shiftSchemas