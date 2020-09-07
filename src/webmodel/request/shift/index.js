const { routes } = require('../../../constant')
const createShiftRequest = require('./CreateShiftRequest')
const updateShiftRequest = require('./UpdateShiftRequest')

const shiftSchemas = {}

shiftSchemas[routes.shift.list] = createShiftRequest
shiftSchemas[routes.shift.id] = updateShiftRequest

module.exports = shiftSchemas