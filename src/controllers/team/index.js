const teamService = require('../../services/teamService');
const ResponseHelper = require('../../helper/ResponseHelper');

const controller = {};

controller.createTeam = async (req, res, next) => {

    const { name, fileId, address, phoneNumber, email } = req.body;

    const teamDTO = {
        eteamname: name,
        eteamaddress: address,
        eteamphonenumber: phoneNumber,
        eteamemail: email,
        ecompanyecompanyid: req.user.companyId,
        efileefileid: fileId
    };

    teamDTO.efileefileid = teamDTO.efileefileid === 0 ? null : teamDTO.efileefileid;

    try {

        const result = await teamService.createTeam(teamDTO, req.user);
        if (!result)
            return res.status(400).json(ResponseHelper.toErrorResponse(400));
        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

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