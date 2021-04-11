const express = require('express');

const router = express.Router();

const masterBankRoutes = require('./masterBank');
const classCategoryRoutes = require('./classCategorySession');

router.use([
    masterBankRoutes,
    classCategoryRoutes,
]);
module.exports = router;