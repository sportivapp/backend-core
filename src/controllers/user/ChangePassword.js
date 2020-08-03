const userService = require('../../services/userService');
const ResponseHelper = require('../../helper/ResponseHelper')

module.exports = async (req, res, next) => {

    const user = req.user;
    const { newPassword } = req.body; 

    try {

        const result = await userService.changeUserPassword(user, newPassword);

        if (!result)
            return res.status(400).json(ResponseHelper.toErrorResponse(400))
        return res.status(200).json(ResponseHelper.toBaseResponse(result))

        
    } catch (e) {
        next(e);
    }
}