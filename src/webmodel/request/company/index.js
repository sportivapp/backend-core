const { routes } = require('../../../constant')
const CompanyUserRequest = require('./CompanyUserRequest')
const CreateCompanyRequest = require('./CreateCompanyRequest')
const RegisterCompanyRequest = require('./RegisterCompanyRequest')

const companySchemas = {}

companySchemas[routes.company.users] = CompanyUserRequest
companySchemas[routes.company.register] = RegisterCompanyRequest
companySchemas[routes.company.list] = CreateCompanyRequest

module.exports = companySchemas