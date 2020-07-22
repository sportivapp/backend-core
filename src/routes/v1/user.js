const express = require('express');
const router = express.Router();
const { Create, Login , List} = require('../../controllers/user');

router.post('/user', Create);
router.post('/user-login', Login);
router.get('/user-list', List);

module.exports = router;