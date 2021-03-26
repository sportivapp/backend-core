const express = require('express');

const router = express.Router();

const classRoutes = require('./class');
const classCategoryRoutes = require('./classCategory');
const classCategorySessionRoutes = require('./classCategorySession');
const classComplaintsRoutes = require('./classComplaints');

router.use([
    classRoutes,
    classCategoryRoutes,
    classCategorySessionRoutes,
    classComplaintsRoutes,
]);
module.exports = router;