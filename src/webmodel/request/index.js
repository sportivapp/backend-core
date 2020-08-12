const companySchemas = require('./company')
const userSchemas = require('./user')
const gradeSchemas = require('./grade')
const absenSchemas = require('./absen')

module.exports = {
    ...companySchemas,
    ...userSchemas,
    ...gradeSchemas,
    ...absenSchemas
}