const express = require('express');
const router = express.Router();
const controller = require('../../controllers/experience');
const auth = require('../../middlewares/authentication');
const { routes } = require('../../constant')

router.post(routes.experience.id, auth.authenticateToken, controller.getExperienceById);

module.exports = router;