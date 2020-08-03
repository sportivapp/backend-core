const userService = require('../../services/userService');
const ResponseHelper = require('../../helper/ResponseHelper')

module.exports = async (req, res, next) => {

    const path = req.file.path;
    const user = req.user;

    try {

        const result = await userService.registerEmployees(user, path);

        if (!result)
            return res.status(400).json(ResponseHelper.toErrorResponse(400))
        return res.status(200).json(ResponseHelper.toBaseResponse(result))

    } catch(e) {
        next(e);
    }

}