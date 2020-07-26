const userService = require('../../services/userService');

module.exports = async (req, res, next) => {

    try {

        const userEmail = req.body.userEmail; 

        await userService.sendForgotPasswordLink( userEmail );

        const data = {
            message: "Successfully Send Password"
        }

        return res.status(200).json({
            data: data
        });
        
    } catch (e) {
        next(e);
    }
}