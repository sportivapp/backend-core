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
]);

const mobileUserRoutes = require('./mobileUser');
const mobileFileRoutes = require('./mobileFile');
const mobileLicenseRoutes = require('./mobileLicense');
const mobileCompanyRoutes = require('./mobileCompany');
const mobileAnnouncementRoutes = require('./mobileAnnouncement');
const mobileApplyInviteRoutes = require('./mobileApplyInvite');
const mobileTeamRoutes = require('./mobileTeam');

router.use('/api/v1/mobile', [
    mobileUserRoutes,
    mobileFileRoutes,
    mobileLicenseRoutes,
    mobileCompanyRoutes,
    mobileAnnouncementRoutes,
    mobileApplyInviteRoutes,
    mobileTeamRoutes
]);

module.exports = router;