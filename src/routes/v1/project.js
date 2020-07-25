const express = require('express');
const router = express.Router();
const { Create, List, Edit } = require('../../controllers/project');
const auth = require('../../middlewares/authentication');

router.post('/project', auth.authenticateToken, Create);
router.get('/project', auth.authenticateToken, List);
router.put('/project/:projectId', auth.authenticateToken, Edit);

module.exports = router;