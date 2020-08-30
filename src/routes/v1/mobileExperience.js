const express = require('express');
const router = express.Router();
const experienceController = require('../../controllers/mobileExperience');
const auth = require('../../middlewares/authentication');
const { routes } = require('../../constant')

router.post(routes.experience.list, auth.authenticateToken, experienceController.createExperience);
router.get(routes.experience.list, auth.authenticateToken, experienceController.getExperienceList);
router.get(routes.experience.id, auth.authenticateToken, experienceController.getExperienceById);
router.put(routes.experience.id, auth.authenticateToken, experienceController.editExperience);
router.delete(routes.experience.id, auth.authenticateToken, experienceController.deleteExperience);

module.exports = router;