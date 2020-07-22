const userService = require('../../services/userService');

module.exports = async (req, res, next) => {

    try {

        const ecompanyId = req.body.ecompanyecompanyid;
        
        const users = await userService.getAllUserByCompanyId(ecompanyId);

        return res.status(200).json({
            data: users
        });

    } catch(e) {
        next(e);
    }

}