const express = require('express');
const router = express.Router();
const { Create } = require('../../controllers/company');

/**
 * @swagger
 * definitions:
 *  Company:
 *      properties:
 *          nik:
 *              type: integer
 *          name:
 *              type: string
 *          email:
 *              type: string
 *          password:
 *              type: string
 *          mobileNumber:
 *              type: string
 *          companyName:
 *              type: string
 *          companyEmail:
 *              type: string
 *          street:
 *              type: string
 *          postalCode:
 *              type: integer
 */

/**
 * @swagger
 * /company:
 *   post:
 *     summary: add/create new company
 *     tags:
 *       - Users
 *     description: send company data to database
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: Company
 *         description: Create company
 *         in: body
 *         schema:
 *          $ref: '#/definitions/Company'
 *     responses:
 *       '200':
 *         description: create a company
 *         schema:
 *          $ref: '#/definitions/Company'
 */
router.post('/company', Create);

module.exports = router;