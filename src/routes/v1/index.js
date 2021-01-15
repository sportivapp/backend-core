const express = require('express');

const router = express.Router();

const adminRoutes = require('./admin')
const mobileRoutes = require('./mobile')
const landingRoutes = require('./landing')
const commonRoutes = require('./common')
const internalRoutes = require('./internal')

router.use('/api/v1', [adminRoutes, mobileRoutes, landingRoutes, commonRoutes, internalRoutes])

const steamRoutes = require('./steam');

router.use([steamRoutes]);

module.exports = router;