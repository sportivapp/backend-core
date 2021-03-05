const verifyService = require('../../services/landing/verifyService');
const ResponseHelper = require('../../helper/ResponseHelper');

const verifyController = {};

verifyController.verifyCMSToken = async (req, res, next) => {

    const { tok } = req.body;

    try {

        const result = await verifyService.verifyCMSToken(tok);
        return res.cookie('tok', result, {
            secure: true,
            httpOnly: true,
            domain: process.env.COOKIE_DOMAIN,
            maxAge: 3 * 24 * 60 * 60 * 1000
        }).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

module.exports = verifyController;