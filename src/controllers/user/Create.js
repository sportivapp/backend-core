const userService = require('../../services/userService');

module.exports = async (req, res, next) => {

    try {

        const path = req.file.path;
        const user = req.user;

        if (user.permission !== 10) {
            return res.status(401).json({
                data: 'You cannot register employees'
            })
        }

        const employees = await userService.registerEmployees(user, path);

        return res.status(200).json({
            data: employees
        });

    } catch(e) {
        next(e);
    }

}