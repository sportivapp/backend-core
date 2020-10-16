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

module.exports = controller