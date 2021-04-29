const express = require('express');

const router = express.Router();

const masterBankRoutes = require('./masterBank');
const classCategoryRoutes = require('./classCategorySession');
const paymentRoutes = require('./payment');
const dokuRoutes = require('./doku');

router.use([
    masterBankRoutes,
    classCategoryRoutes,
    paymentRoutes,
    dokuRoutes,
]);
module.exports = router;