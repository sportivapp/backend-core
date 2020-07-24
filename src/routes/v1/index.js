const express = require('express');

const router = express.Router();

const userRoutes = require('./user');
const companyRoutes = require('./company');
const projectRoutes = require('./project');

router.use('/api/v1', [
    userRoutes,
    companyRoutes,
    projectRoutes,
]);

module.exports = router;