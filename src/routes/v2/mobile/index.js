const express = require('express');

const router = express.Router();

const mobileClassRoutes = require('./mobileClass');
const mobileClassCategoryRoutes = require('./mobileClassCategory');
const mobileClassCategorySessionRoutes = require ('./mobileClassCategorySession');

router.use([
    mobileClassRoutes,
    mobileClassCategoryRoutes,
    mobileClassCategorySessionRoutes,
]);

module.exports = router