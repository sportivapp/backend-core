const { routes } = require('../../../constant')
const CreateProjectRequest = require('./CreateProjectRequest')
const UpdateProjectRequest = require('./UpdateProjectRequest')
const SaveTimesheetRequest = require('./SaveTimesheetRequest')

const projectSchemas = {}

projectSchemas[routes.project.list] = CreateProjectRequest
projectSchemas[routes.project.id] = UpdateProjectRequest
projectSchemas[routes.project.timesheet] = SaveTimesheetRequest

module.exports = projectSchemas