const { routes } = require('../../../constant')
const CompanyUserRequest = require('./CompanyUserRequest')
const CreateCompanyRequest = require('./CreateCompanyRequest')
const RegisterCompanyRequest = require('./RegisterCompanyRequest')
const SaveUsersToCompanyRequest =require('./SaveUsersToCompanyRequest')

const companySchemas = {}

companySchemas[routes.company.users] = CompanyUserRequest
companySchemas[routes.company.register] = RegisterCompanyRequest
companySchemas[routes.company.list] = CreateCompanyRequest
companySchemas[routes.company.users] = SaveUsersToCompanyRequest

module.exports = companySchemas