const { routes } = require('../../../constant')
const ShiftRequest = require('./ShiftRequest')

const shiftSchemas = {}

shiftSchemas[routes.shift.list] = ShiftRequest
shiftSchemas[routes.shift.id] = ShiftRequest

module.exports = shiftSchemas