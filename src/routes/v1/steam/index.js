const express = require('express');

const router = express.Router();

const steamRoutes = require('./steam');

router.use([
    steamRoutes,
]);
module.exports = router;