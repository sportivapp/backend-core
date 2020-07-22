const express = require('express');
const router = express.Router();
const { Create, Login , List} = require('../../controllers/user');
const auth = require('../../middlewares/authentication');
const multer = require('multer');
const Template = require('../../controllers/user/Template');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage })

/**
 * @swagger
 * definitions:
 *  Login:
 *      properties:
 *          email:
 *              type: string
 *          password:
 *              type: string
 */

router.post('/user', auth.authenticateToken, upload.single('employee'), Create);

/**
 * @swagger
 * /user-login:
 *   post:
 *     summary: user login
 *     tags:
 *       - Login
 *     description: Login
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: UserLogin
 *         description: 
 *         in: body
 *         schema:
 *          $ref: '#/definitions/Login'
 *     responses:
 *       '200':
 *         description: do login
 *         schema:
 *          $ref: '#/definitions/Login'
 */
router.post('/user-login', Login);
router.get('/user-list', List);
router.get('/user-import-template', Template);

module.exports = router;