const express = require('express');

const router = express.Router();

const userRoutes = require('./users');
const companyRoutes = require('./company');

router.use('/api/v1', [
    userRoutes,
    companyRoutes,
]);

module.exports = router;