const companySchemas = require('./company')
const userSchemas = require('./user')
const gradeSchemas = require('./grade')
const absenSchemas = require('./absen')
const announcementSchemas = require('./announcement')
const departmentSchemas = require('./department')
const deviceSchemas = require('./device')
const rosterSchemas = require('./roster')
const projectSchemas = require('./project')
const timesheetSchemas = require('./timesheet')
const shiftSchemas = require('./shift')
const shiftPatternSchemas = require('./shiftPattern')
const experienceSchemas = require('./experience')

module.exports = {
    ...companySchemas,
    ...userSchemas,
    ...gradeSchemas,
    ...absenSchemas,
    ...announcementSchemas,
    ...departmentSchemas,
    ...deviceSchemas,
    ...rosterSchemas,
    ...projectSchemas,
    ...timesheetSchemas,
    ...shiftSchemas,
    ...shiftPatternSchemas,
    ...experienceSchemas
}