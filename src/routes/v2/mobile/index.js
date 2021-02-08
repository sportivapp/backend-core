const express = require('express');

const router = express.Router();

const mobileClassRoutes = require('./mobileClass');

router.use([
    mobileClassRoutes,
]);

module.exports = router