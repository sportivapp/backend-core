const express = require('express');

const router = express.Router();

const adminRoutes = require('./admin');
const mobileRoutes = require('./mobile');
const landingRoutes = require('./landing');
const commonRoutes = require('./common');

router.use('/core/api/v1', [adminRoutes, mobileRoutes, landingRoutes, commonRoutes]);

module.exports = router;