const companySchemas = require('./company')
const userSchemas = require('./user')
const gradeSchemas = require('./grade')
const absenSchemas = require('./absen')
const announcementSchemas = require('./announcement')
const departmentSchemas = require('./department')
const deviceSchemas = require('./device')
const rosterSchemas = require('./roster')

module.exports = {
    ...companySchemas,
    ...userSchemas,
    ...gradeSchemas,
    ...absenSchemas,
    ...announcementSchemas,
    ...departmentSchemas,
    ...deviceSchemas,
    ...rosterSchemas
}