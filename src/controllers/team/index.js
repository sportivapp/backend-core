const teamService = require('../../services/teamService');
const ResponseHelper = require('../../helper/ResponseHelper');

const controller = {};

controller.getTeamsByCompanyId = async (req, res, next) => {

    const { page, size, companyId } = req.query;
    
    try {

        const result = await teamService.getTeamByCompanyId(page, size, parseInt(companyId));

        if (!result)
            return res.status(404).json(ResponseHelper.toErrorResponse(404));
        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

module.exports = controller