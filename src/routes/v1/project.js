const express = require('express');
const router = express.Router();
const { Create, List, Edit, Delete } = require('../../controllers/project');
const auth = require('../../middlewares/authentication');

router.post('/project', auth.authenticateToken, Create);
router.get('/project', auth.authenticateToken, List);
router.put('/project/:projectId', auth.authenticateToken, Edit);
router.delete('/project/:projectId', auth.authenticateToken, Delete);

module.exports = router;