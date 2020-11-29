const express = require('express');

const router = express.Router();

const companyRoutes = require('./company');
const projectRoutes = require('./project');
const rosterRoutes = require('./roster');
const announcementRoutes = require('./announcement');
const absenRoutes = require('./absen');
const permitRoutes = require('./permit');
const deviceRoutes = require('./device');
const departmentRoutes = require('./department');
const settingRoutes = require('./setting');
const gradeRoutes = require('./grade')
const timesheetRoutes = require('./timesheet')
const shiftRoutes = require('./shift')
const shiftPatternRoutes = require('./shiftPattern')
const todoListRoutes = require('./todolist')
const approvalRoutes = require('./approval')
const teamRoutes = require('./team');
const companyLogRoutes = require('./companyLog');
const theoryRoutes = require('./theory');
const experienceRoutes = require('../common/experience');
const licenseRoutes = require('./license');
const classRoutes = require('./class')
const classUserRoutes = require('./classUser');
const newsRoutes = require('./news')
const threadRoutes = require('./thread')
const threadPostRoutes = require('./threadPost');
const teamUserMappingRoutes = require('./teamUserMapping')

router.use([
    companyRoutes,
    projectRoutes,
    rosterRoutes,
    announcementRoutes,
    absenRoutes,
    permitRoutes,
    deviceRoutes,
    departmentRoutes,
    settingRoutes,
    gradeRoutes,
    timesheetRoutes,
    shiftRoutes,
    shiftPatternRoutes,
    todoListRoutes,
    approvalRoutes,
    teamRoutes,
    companyLogRoutes,
    theoryRoutes,
    experienceRoutes,
    licenseRoutes,
    classRoutes,
    classUserRoutes,
    newsRoutes,
    threadRoutes,
    threadPostRoutes,
    teamUserMappingRoutes
]);
module.exports = router