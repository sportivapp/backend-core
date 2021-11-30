const express = require('express');

const router = express.Router();

const masterBankRoutes = require('./masterBank');
const classCategoryRoutes = require('./classCategorySession');
const paymentRoutes = require('./payment');
const dokuRoutes = require('./doku');
const bcaRoutes = require('./bca');
const xenditRoutes = require('./xenditPayment');
const disbursementRoutes = require('./disbursement');
const disbursementRequestRoutes = require('./disbursementRequest');

router.use([
    masterBankRoutes,
    classCategoryRoutes,
    paymentRoutes,
    dokuRoutes,
    bcaRoutes,
    xenditRoutes,
    disbursementRoutes,
    disbursementRequestRoutes,
]);
module.exports = router;