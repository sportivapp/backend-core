const { routes } = require('../../../constant')
const CreateTimesheetRequest = require('./CreateTimesheetRequest')
const UpdateTimesheetRequest = require('./UpdateTimesheetRequest')

const rosterSchemas = {}

rosterSchemas[routes.timesheet.list] = CreateTimesheetRequest
rosterSchemas[routes.timesheet.id] = UpdateTimesheetRequest

module.exports = rosterSchemas