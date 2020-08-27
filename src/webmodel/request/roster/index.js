const { routes } = require('../../../constant')
const CreateRosterRequest = require('./CreateRosterRequest')
const UpdateUsersOfRostersRequest = require('./UpdateUsersOfRostersRequest')
const UpdateRosterRequest = require('./UpdateRosterRequest')
const AssignRosterToShiftTimeRequest = require('./AssignRosterToShiftTimeRequest')

const rosterSchemas = {}

rosterSchemas[routes.roster.roster] = CreateRosterRequest
rosterSchemas[routes.roster.members] = UpdateUsersOfRostersRequest
rosterSchemas[routes.roster.rosterId] = UpdateRosterRequest
rosterSchemas[routes.roster.memberAssign] = AssignRosterToShiftTimeRequest

module.exports = rosterSchemas