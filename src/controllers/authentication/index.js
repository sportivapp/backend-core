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

        return res.cookie('tok', result, {
            secure: true,
            httpOnly: true,
            domain: process.env.COOKIE_DOMAIN,
            maxAge: 3 * 60 * 60 * 1000
        }).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

controller.logout = async (req, res, next) => {

    return res.cookie('tok', undefined, {
        domain: process.env.COOKIE_DOMAIN,
        maxAge: 0
    }).send(ResponseHelper.toBaseResponse(true));
}

controller.loginCompany = async (req, res, next) => {

    const { companyId } = req.body;

    try {

        const result = await authenticationService.loginCompany(companyId, req.user);

        // return res.status(200).cookie('tok', result, {
        //     secure: true,
        //     httpOnly: true,
        //     domain: process.env.COOKIE_DOMAIN,
        //     maxAge: 15 * 60 * 1000
        // }).json(ResponseHelper.toBaseResponse(process.env.ORG_DOMAIN));

        // return res.cookie('tok', result, {
        //     secure: true,
        //     httpOnly: true,
        //     domain: process.env.COOKIE_DOMAIN,
        //     maxAge: 15 * 60 * 1000
        // }).redirect(process.env.ORG_DOMAIN);

        // return res.redirect(result);

        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

controller.autoLogin = async (req, res, next) => {

    const { token } = req.body;

    try {

        const result = await authenticationService.autoLogin(token);

        return res.cookie('tok', result, {
            secure: true,
            httpOnly: true,
            domain: process.env.COOKIE_DOMAIN,
            maxAge: 15 * 60 * 1000
        }).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

module.exports = controller