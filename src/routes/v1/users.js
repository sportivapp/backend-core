const express = require('express');
const router = express.Router();
const { Create, Login } = require('../../controllers/user');

router.post('/user', Create);
router.post('/user-login', Login);

module.exports = router;