const authenticationService = require('../../services/authenticationService');
const ResponseHelper = require('../../helper/ResponseHelper');

const controller = {};

controller.login = async (req, res, next) => {

    const { email, password } = req.body;

    const loginDTO = {
        email: email,
        password: password
    }

    try {

        const result = await authenticationService.login(loginDTO);

        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

controller.loginCompany = async (req, res, next) => {

    const { companyId } = req.body;

    try {

        const result = await authenticationService.loginCompany(companyId, req.user);

        // return res.redirect(302, process.env.ORG_DOMAIN);
        return res.status(200).cookie('tok', result, {
            secure: true,
            httpOnly: true,
            domain: process.env.COOKIE_DOMAIN,
            maxAge: 15 * 60 * 1000
        }).json(ResponseHelper.toBaseResponse(process.env.ORG_DOMAIN));

    } catch(e) {
        next(e);
    }

}

module.exports = controller