const express = require('express');
const router = express.Router();
const { Create } = require('../../controllers/users');

router.post('/users', Create);

module.exports = router;