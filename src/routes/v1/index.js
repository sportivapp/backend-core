const express = require('express');

const router = express.Router();

const userRoutes = require('./user');
const companyRoutes = require('./company');
const projectRoutes = require('./project');
const rosterRoutes = require('./roster');
const announcementRoutes = require('./announcement');

router.use('/api/v1', [
    userRoutes,
    companyRoutes,
    projectRoutes,
    rosterRoutes,
    announcementRoutes
]);

module.exports = router;