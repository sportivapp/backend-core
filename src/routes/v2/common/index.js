const express = require('express');

const router = express.Router();

const masterBankRoutes = require('./masterBank');
const classCategoryRoutes = require('./classCategorySession');
const paymentRoutes = require('./payment');

router.use([
    masterBankRoutes,
    classCategoryRoutes,
    paymentRoutes,
]);
module.exports = router;