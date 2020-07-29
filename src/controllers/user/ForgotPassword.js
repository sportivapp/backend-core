const userService = require('../../services/userService');

module.exports = async (req, res, next) => {

    try {

        const email = req.body.email; 

        await userService.sendForgotPasswordLink( email );

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