const express = require('express');
const router = express.Router();
const controller = require('../../controllers/sporttype')

router.get('/sport-type', controller.getSportTypes);

module.exports = router;