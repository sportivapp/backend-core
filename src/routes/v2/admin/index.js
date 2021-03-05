const express = require('express');

const router = express.Router();

const classRoutes = require('./class');
const classCategoryRoutes = require('./classCategory');
const classCategorySessionRoutes = require('./classCategorySession');

router.use([
    classRoutes,
    classCategoryRoutes,
    classCategorySessionRoutes,
]);
module.exports = router;