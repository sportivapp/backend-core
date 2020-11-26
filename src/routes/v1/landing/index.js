const express = require('express');

const router = express.Router();

const newsUserRoutes = require('./newsUser');
const companyRoutes = require('./organization')
const companyUserRoutes = require('./organizationUser')
const companyLogRoutes = require('./organizationLog')

router.use([
    companyRoutes,
    newsUserRoutes,
    companyUserRoutes,
    companyLogRoutes
]);
module.exports = router