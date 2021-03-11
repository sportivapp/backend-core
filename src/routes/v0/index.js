const express = require('express');
const router = express.Router();

const mobileRoutes = require('./mobile');

router.use('/api/v1', [mobileRoutes]);

module.exports = router;