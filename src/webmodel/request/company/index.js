const { routes } = require('../../../constant')
const CompanyUserRequest = require('./CompanyUserRequest')

const companySchemas = {}

companySchemas[routes.company.users] = CompanyUserRequest

module.exports = companySchemas