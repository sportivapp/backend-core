const userService = require('../../services/userService');
const ResponseHelper = require('../../helper/ResponseHelper')

module.exports = async (req, res, next) => {

    const { email, password } = req.body;
    const loginDTO = { 
        euseremail: email, 
        euserpassword: password
    }

    try {

        const result = await userService.login(loginDTO);

        if (!result)
            return res.status(400).json(ResponseHelper.toErrorResponse(400))
        return res.status(200).json(ResponseHelper.toBaseResponse(result))

    } catch(e) {
        next(e);
    }

}