const { routes } = require('../../../constant')
const CreateRosterRequest = require('./CreateRosterRequest')

const rosterSchemas = {}

rosterSchemas[routes.roster.roster] = CreateRosterRequest

module.exports = rosterSchemas