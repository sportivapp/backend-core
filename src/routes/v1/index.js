const express = require('express');

const router = express.Router();

const userRoutes = require('./user');
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
const industryRoutes = require('./industry')
const stateRoutes = require('./state')
const countryRoutes = require('./country')
const timesheetRoutes = require('./timesheet')
const shiftRoutes = require('./shift')
const shiftPatternRoutes = require('./shiftPattern')
const todoListRoutes = require('./todolist')
const profileRoutes = require('./profile')
const approvalRoutes = require('./approval')
const otpRoutes = require('./otp');
const teamRoutes = require('./team');


router.use('/api/v1', [
    userRoutes,
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
    industryRoutes,
    stateRoutes,
    countryRoutes,
    timesheetRoutes,
    shiftRoutes,
    shiftPatternRoutes,
    todoListRoutes,
    profileRoutes,
    approvalRoutes,
    otpRoutes,
    teamRoutes
]);

const mobileUserRoutes = require('./mobileUser');
const mobileFileRoutes = require('./mobileFile');
const mobileLicenseRoutes = require('./mobileLicense');
const mobileCompanyRoutes = require('./mobileCompany');
const mobileAnnouncementRoutes = require('./mobileAnnouncement');
const mobileApplyInviteRoutes = require('./mobileApplyInvite');
const mobileTeamRoutes = require('./mobileTeam');
const mobileExperienceRoutes = require('./mobileExperience');

router.use('/api/v1/mobile', [
    mobileUserRoutes,
    mobileFileRoutes,
    mobileLicenseRoutes,
    mobileCompanyRoutes,
    mobileAnnouncementRoutes,
    mobileApplyInviteRoutes,
    mobileTeamRoutes,
    mobileExperienceRoutes
]);

module.exports = router;