const teamUserService = require('../../services/teamUserMappingService')
const ResponseHelper = require('../../helper/ResponseHelper')

const controller = {}

controller.isAdmin = async (req, res, next) => {

    const { teamId } = req.params;

    try {
         
        const result = await teamUserService.isAdmin(teamId, req.user.sub);

        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

module.exports = controller