const express = require('express');
const router = express.Router();
const { Create } = require('../../controllers/project');
const auth = require('../../middlewares/authentication');

router.post('/project', auth.authenticateToken, Create);

module.exports = router;