const express = require('express');
const router = express.Router();
const controller = require('../../controllers/mobileNews')
const auth = require('../../middlewares/authentication');
const { routes } = require('../../constant')

router.get( routes.news.id, controller.getNewsDetail);

module.exports = router;