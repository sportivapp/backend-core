const userService = require('../../services/userService');

module.exports = async (req, res, next) => {

    try {

        const user = req.user;
        const { newPassword } = req.body; 

        await userService.changeUserPassword(user, newPassword);

        return res.status(200).json({
            data: 'Password Successfully Change!'
        });
        
    } catch (e) {
        console.log(e);
        next(e);
    }
}