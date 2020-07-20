const express = require('express');

const router = express.Router();

const userRoutes = require('./users');

router.use('/api/v1', [
    userRoutes,
]);

module.exports = router;