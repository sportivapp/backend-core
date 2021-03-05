const express = require('express');

const router = express.Router();

const companyRoutes = require('./organization')
const companyUserRoutes = require('./organizationUser')
const companyLogRoutes = require('./organizationLog')
const authenticationRoutes = require('./authentication')
const countryRoutes = require('./country')
const stateRoutes = require('./state')
const otpRoutes = require('./otp')
const profileRoutes = require('./profile')
const forgetRoutes = require('./forget')
const permissionRoutes = require('./permission')
const verifyRoutes = require('./verify')

router.use([
    authenticationRoutes,
    countryRoutes,
    stateRoutes,
    otpRoutes,
    profileRoutes,
    forgetRoutes,
    companyRoutes,
    companyUserRoutes,
    companyLogRoutes,
    permissionRoutes,
    verifyRoutes
]);
module.exports = router