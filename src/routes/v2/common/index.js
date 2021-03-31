const express = require('express');

const router = express.Router();

const masterBankRoutes = require('./masterBank');

router.use([
    masterBankRoutes,
]);
module.exports = router;