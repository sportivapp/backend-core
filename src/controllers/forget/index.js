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

controller.checkForgetLink = async (req, res, next) => {

    const { token, email } = req.params;

    try {

        await forgetService.checkForgetLink(token, email);

        return res.status(200).json(ResponseHelper.toBaseResponse(true));

    } catch(e) {
        next(e);
    }
    
}

controller.setPassword = async (req, res, next) => {

    const { token, email } = req.params;
    const { password } = req.body;

    try {

        const result = await forgetService.checkForgetLink(token, email, password);

        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }
    
}

module.exports = controller;