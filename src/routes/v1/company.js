const express = require('express');
const router = express.Router();
const { Create } = require('../../controllers/company');

router.post('/company', Create);

module.exports = router;