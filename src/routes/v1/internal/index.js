const express = require('express');

const router = express.Router();

const tournamentRoutes = require('./tournament');
const notificationRoutes = require('./notification');

router.use([
    tournamentRoutes,
    notificationRoutes
]);
module.exports = router