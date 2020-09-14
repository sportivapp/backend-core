const express = require('express');
const router = express.Router();
const controller = require('../../controllers/mobileUser');
const auth = require('../../middlewares/authentication');
const { routes } = require('../../constant');
const { getIndustryByUserId } = require('../../services/mobileUserService');

router.post('/user', controller.createUser);
router.post('/user-login', controller.login);
router.put( routes.user.coach, auth.authenticateToken, controller.updateUserCoachData);
router.delete( routes.user.removeCoach, auth.authenticateToken, controller.removeCoach);
router.post('/user-profile', auth.authenticateToken, controller.getOtherUserById);
router.get('/user-self-profile', auth.authenticateToken, controller.getSelf);
router.get( routes.user.pending, auth.authenticateToken, controller.getListPendingByUserId);
router.put('/user', auth.authenticateToken, controller.updateUser);
router.get( routes.user.industry, auth.authenticateToken, controller.getIndustryByUserId );
router.put( routes.user.industry, auth.authenticateToken, controller.changeIndustryByUserId);
router.post('/user-change-password', auth.authenticateToken, controller.changePassword);

module.exports = router;