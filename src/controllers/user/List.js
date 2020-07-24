const userService = require('../../services/userService');

module.exports = async (req, res, next) => {

    try {

        const companyId = req.body.companyId;
        
        const users = await userService.getAllUserByCompanyId(companyId);

        return res.status(200).json({
            data: users
        });

    } catch(e) {
        next(e);
    }

}