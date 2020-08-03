const userService = require('../../services/userService');

module.exports = async (req, res, next) => {

    const user = req.user;
    const { newPassword } = req.body; 

    try {

        // return 1 for true , 0 for false
        const changePassword = await userService.changeUserPassword(user, newPassword);

        const data = {
            isChanged: (changePassword) ? true : false,
            message: (changePassword) ? "Password Successfully Changed!" : "Failed to Change Password!"
        }

        return res.status(200).json({
            data: data
        });
        
    } catch (e) {
        next(e);
    }
}