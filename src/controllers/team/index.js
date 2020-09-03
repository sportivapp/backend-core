const teamService = require('../../services/teamService');
const ResponseHelper = require('../../helper/ResponseHelper');

const controller = {};

controller.createTeam = async (req, res, next) => {

    const { name, fileId, address, phoneNumber, email, industryIds } = req.body;

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

        const result = await teamService.createTeam(teamDTO, req.user, industryIds);
        if (!result)
            return res.status(400).json(ResponseHelper.toErrorResponse(400));
        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

controller.getTeamsByCompanyId = async (req, res, next) => {

    const { page, size } = req.query;
    
    try {

        const pageObj = await teamService.getTeamsByCompanyId(page, size, req.user.companyId);

        if (!pageObj)
            return res.status(404).json(ResponseHelper.toErrorResponse(404))
        return res.status(200).json(ResponseHelper.toPageResponse(pageObj.data, pageObj.paging))

    } catch(e) {
        next(e);
    }

}

controller.getTeamDetailByCompanyId = async (req, res, next) => {

    const { teamId } = req.params
    
    try {

        const result = await teamService.getTeamDetailByCompanyId(req.user.companyId, teamId);

        if (!result)
            return res.status(404).json(ResponseHelper.toErrorResponse(404));
        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

// add user in company to team (to get all user by company, check user service)
controller.addUserToTeam = async (req, res, next) => {

    const { teamId, userIds } = req.body;
    
    try {

        const result = await teamService.addUserToTeam(teamId, req.user, userIds);

        if (!result)
            return res.status(400).json(ResponseHelper.toErrorResponse(400));
        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

controller.getTeamMemberList = async (req, res, next) => {

    // INVITE / APPLY / MEMBER
    const { type } = req.query;
    const { teamId } = req.body;
    
    try {

        const result = await teamService.getTeamMemberList(teamId, req.user, type.toUpperCase());

        if (result === 'type unaccepted')
            return res.status(400).json(ResponseHelper.toErrorResponse(400));
        if (!result)
            return res.status(404).json(ResponseHelper.toErrorResponse(404));
        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

// invite user by email to team
controller.invite = async (req, res, next) => {

    const { teamId, email } = req.body;

    try {

        const result = await teamService.invite(teamId, req.user, email);

        if (result === 'not admin')
            return res.status(403).json(ResponseHelper.toErrorResponse(403));
        if (result === 'user does not exist')
            return res.status(400).json(ResponseHelper.toErrorResponse(400));
        if (result === 'user already in team')
            return res.status(400).json(ResponseHelper.toErrorResponse(400));
        if (!result)
            return res.status(400).json(ResponseHelper.toErrorResponse(400));
        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

controller.processRequest = async (req, res, next) => {

    const { teamId, userId } = req.body;
    const { status } = req.query;
    
    try {

        const result = await teamService.processRequest(teamId, userId, req.user, status.toUpperCase());

        if (result === 'status unaccepted')
            return res.status(400).json(ResponseHelper.toErrorResponse(400));
        if (result === 'not admin')
            return res.status(403).json(ResponseHelper.toErrorResponse(403));
        if (!result)
            return res.status(400).json(ResponseHelper.toErrorResponse(400));
        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

controller.processInvitation = async (req, res, next) => {

    const { teamId } = req.body;
    const { status } = req.query;

    try {

        const result = await teamService.processInvitation(teamId, req.user, status.toUpperCase());

        if (result === 'status unaccepted')
            return res.status(400).json(ResponseHelper.toErrorResponse(400));
        if (result === 'no invitation')
            return res.status(400).json(ResponseHelper.toErrorResponse(400));
        if (!result)
            return res.status(400).json(ResponseHelper.toErrorResponse(400));
        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

module.exports = controller