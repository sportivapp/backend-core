const express = require('express');

const router = express.Router();

const classRoutes = require('./class');

router.use([
    classRoutes,
]);
module.exports = router;