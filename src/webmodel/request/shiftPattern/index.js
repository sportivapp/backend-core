const { routes } = require('../../../constant')
const CreateShiftPatternRequest = require('./CreateShiftPatternRequest')
const UpdateShiftPatternRequest = require('./UpdateShiftPatternRequest')

const shiftSchemas = {}

shiftSchemas[routes.shiftPattern.list] = CreateShiftPatternRequest
shiftSchemas[routes.shiftPattern.id] = UpdateShiftPatternRequest

module.exports = shiftSchemas