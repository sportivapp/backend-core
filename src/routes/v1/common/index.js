const express = require('express');

const router = express.Router();

const authenticationRoutes = require('./authentication');
const sportTypeRoleRoutes = require('./sportTypeRole')
const notificationRoutes = require('./notification');
const forgetRoutes = require('./forget');
const fileRoutes = require('./file');
const otpRoutes = require('./otp');
const profileRoutes = require('./profile')
const industryRoutes = require('./industry')
const stateRoutes = require('./state')
const countryRoutes = require('./country')
const reportThreadRoutes = require('./reportThread')
const experienceRoutes = require('./experience')
const threadPostReplyRoutes = require('./threadPostReply')
const userRoutes = require('./user');
const cityRoutes = require('./city');
const bannerRoutes = require('./banner');

router.use([
    industryRoutes,
    stateRoutes,
    countryRoutes,
    profileRoutes,
    otpRoutes,
    fileRoutes,
    notificationRoutes,
    forgetRoutes,
    authenticationRoutes,
    sportTypeRoleRoutes,
    reportThreadRoutes,
    experienceRoutes,
    threadPostReplyRoutes,
    userRoutes,
    cityRoutes,
    bannerRoutes,
]);

module.exports = router