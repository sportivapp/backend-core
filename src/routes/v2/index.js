const express = require('express');

const router = express.Router();

const adminRoutes = require('./admin');
const mobileRoutes = require('./mobile');
const landingRoutes = require('./landing');

router.use('/core/api/v1', [adminRoutes, mobileRoutes, landingRoutes]);

module.exports = router;