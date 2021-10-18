const express = require('express');

const router = express.Router();

const mobileClassRoutes = require('./mobileClass');
const mobileClassCategoryRoutes = require('./mobileClassCategory');
const mobileClassCategorySessionRoutes = require('./mobileClassCategorySession');
const mobileClassComplaintsRoutes = require('./mobileClassComplaints');

router.use([
    mobileClassRoutes,
    mobileClassCategoryRoutes,
    mobileClassCategorySessionRoutes,
    mobileClassComplaintsRoutes,
]);

module.exports = router