const express = require('express');

const router = express.Router();

const adminRoutes = require('./admin');
const mobileRoutes = require('./mobile');

router.use('/api/v2', [adminRoutes, mobileRoutes]);

module.exports = router;