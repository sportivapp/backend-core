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
const approvalSchemas = require('./approval')
const permitSchemas = require('./permit')
const newsSchemas = require('./news')
const threadSchemas = require('./thread')
const threadPostSchemas = require('./threadPost')
const threadPostReplySchemas = require('./threadPostReply')
const reportThreadSchemas = require('./reportThread')

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
    ...experienceSchemas,
    ...approvalSchemas,
    ...permitSchemas,
    ...newsSchemas,
    ...threadSchemas,
    ...threadPostSchemas,
    ...threadPostReplySchemas,
    ...reportThreadSchemas
}