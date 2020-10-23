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
const fileRoutes = require('./file');
const companyLogRoutes = require('./companyLog');
const theoryRoutes = require('./theory');
const notificationRoutes = require('./notification');
const forgetRoutes = require('./forget');
const experienceRoutes = require('./experience');
const licenseRoutes = require('./license');
const classRoutes = require('./class')
const classUserRoutes = require('./classUser');
const newsRoutes = require('./news')
const threadRoutes = require('./thread')
const threadPostRoutes = require('./threadPost');
const authenticationRoutes = require('./authentication');
const sportTypeRoleRoutes = require('./sportTypeRole')
const threadPostReplyRoutes = require('./threadPostReply')
const teamUserMappingRoutes = require('./teamUserMapping')
const reportThreadRoutes = require('./reportThread')

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
    teamRoutes,
    fileRoutes,
    companyLogRoutes,
    theoryRoutes,
    notificationRoutes,
    forgetRoutes,
    experienceRoutes,
    licenseRoutes,
    classRoutes,
    classUserRoutes,
    newsRoutes,
    threadRoutes,
    threadPostRoutes,
    authenticationRoutes,
    sportTypeRoleRoutes,
    threadPostReplyRoutes,
    teamUserMappingRoutes,
    reportThreadRoutes
]);

const mobileUserRoutes = require('./mobileUser');
const mobileLicenseRoutes = require('./mobileLicense');
const mobileCompanyRoutes = require('./mobileCompany');
const mobileAnnouncementRoutes = require('./mobileAnnouncement');
const mobileTeamRoutes = require('./mobileTeam');
const mobileExperienceRoutes = require('./mobileExperience');
const mobileClassRoutes = require('./mobileClass');
const mobileClassUserRoutes = require('./mobileClassUser');
const mobileAppVersionRoutes = require('./mobileAppVersion');
const mobileNewsRoutes = require('./mobileNews');
const mobileForumRoutes = require('./mobileForum');
const mobileCommentRoutes = require('./mobileComment');
const mobileTeamUserRoutes = require('./mobileTeamUser');
const mobileTeamLogRoutes = require('./mobileTeamLog');
const mobileCompanyLogRoutes = require('./mobileCompanyLog')

router.use('/api/v1', [
    mobileUserRoutes,
    mobileLicenseRoutes,
    mobileCompanyRoutes,
    mobileAnnouncementRoutes,
    mobileTeamRoutes,
    mobileExperienceRoutes,
    mobileClassRoutes,
    mobileClassUserRoutes,
    mobileAppVersionRoutes,
    mobileNewsRoutes,
    mobileForumRoutes,
    mobileCommentRoutes,
    mobileTeamUserRoutes,
    mobileTeamLogRoutes,
    threadPostReplyRoutes,
    mobileCompanyLogRoutes
]);

module.exports = router;