const otpService = require('../../services/otpService');
const ResponseHelper = require('../../helper/ResponseHelper');

const controller = {};

controller.createOtp = async (req, res, next) => {

    const { email } = req.body;

    try {
        const result = await otpService.createOtp(email.toLowerCase());

        if (!result)
            return res.status(400).json(ResponseHelper.toErrorResponse(400));
        return res.status(200).json(ResponseHelper.toBaseResponse(result));
    } catch(e) {
        next(e);
    }

}

module.exports = controller;