const express = require('express');

const router = express.Router();

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
const myMobileForumRoutes = require('./myMobileForum')
const mobileTheoryRoutes = require('./mobileTheory');

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
    mobileCompanyLogRoutes,
    myMobileForumRoutes,
    mobileTheoryRoutes
]);

module.exports = router