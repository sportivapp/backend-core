const express = require('express');
const router = express.Router();

const mobileAppVersionRoutes = require('./mobileAppVersion');

router.use([
    mobileAppVersionRoutes,
]);

module.exports = router