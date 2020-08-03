const userService = require('../../services/userService');

module.exports = async (req, res, next) => {
    
    const email = req.body.email; 

    try {

        const result = await userService.sendForgotPasswordLink( email );

        return res.status(200).json(ResponseHelper.toBaseResponse(result))
        
    } catch (e) {
        next(e);
    }
}