const forgetService = require('../../services/forgetService');
const ResponseHelper = require('../../helper/ResponseHelper');

const controller = {};

controller.sendForgetEmail = async (req, res, next) => {

    const { email } = req.body;

    try {
        const result = await forgetService.sendForgetEmail(email);

        return res.status(200).json(ResponseHelper.toBaseResponse(result));
    } catch(e) {
        next(e);
    }

}

module.exports = controller;