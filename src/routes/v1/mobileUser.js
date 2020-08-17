const express = require('express');
const router = express.Router();
const controller = require('../../controllers/mobileUser');
const auth = require('../../middlewares/authentication');

router.post('/user', controller.createUser);
router.post('/user-login', controller.login);
router.post('/user-profile', auth.authenticateToken, controller.getUserById);
router.get('/user-self-profile', auth.authenticateToken, controller.getSelf);
router.put('/user', auth.authenticateToken, controller.updateUser);
router.post('/user-change-password', auth.authenticateToken, controller.changePassword);

module.exports = router;