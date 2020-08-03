const ResponseHelper = require('../../helper/ResponseHelper')
const rosterService = require('../../services/rosterService');

module.exports = async (req, res, next) => {
    
    const { rosterId } = req.params;
    const user = req.user;

    try {

        const result = await rosterService.viewRosterById(rosterId, user);

        if (!result)
            return res.status(400).json(ResponseHelper.toErrorResponse(400))
        return res.status(200).json(ResponseHelper.toBaseResponse(result))

    } catch(e) {
        next(e);
    }

}