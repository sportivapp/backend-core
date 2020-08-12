const companySchemas = require('./company')
const userSchemas = require('./user')
const gradeSchemas = require('./grade')

module.exports = {
    ...companySchemas,
    ...userSchemas,
    ...gradeSchemas
}