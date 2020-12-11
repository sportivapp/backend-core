const express = require('express');

const router = express.Router();

const tournamentRoutes = require('./tournament');

router.use([
    tournamentRoutes
]);
module.exports = router