const userService = require('../../services/userService');

module.exports = async (req, res, next) => {

    try {
        
        const user = req.user;
        const userId = req.body.euserId;

        if (user.permission !== 10) {
            return res.status(401).json({
                data: 'You cannot register employees'
            })
        }

        // return 1 for true , 0 for false
        const deleteUser = await userService.deleteUserById(userId);

        const data = {
            isDeleted: (deleteUser) ? true : false,
            message: (deleteUser) ? "User Successfully Delete!" : "User Not Found!"
        }

        return res.status(200).json({
            data: data
        })

    } catch (e) {
        console.log(e);
        next(e);
    }

}