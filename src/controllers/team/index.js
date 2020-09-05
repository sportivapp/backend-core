const teamService = require('../../services/teamService');
const ResponseHelper = require('../../helper/ResponseHelper');

const controller = {};

controller.createTeam = async (req, res, next) => {

    const { name, fileId, description, industryIds } = req.body;

    const teamDTO = {
        eteamname: name,
        eteamdescription: description,
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

controller.getTeams = async (req, res, next) => {

    const { keyword, page, size } = req.query;
    
    try {

        const pageObj = await teamService.getTeams(keyword, parseInt(page), parseInt(size), req.user);

        if (!pageObj)
            return res.status(404).json(ResponseHelper.toErrorResponse(404))
        return res.status(200).json(ResponseHelper.toPageResponse(pageObj.data, pageObj.paging))

    } catch(e) {
        next(e);
    }

}

controller.getTeamDetail = async (req, res, next) => {

    const { teamId } = req.params
    
    try {

        const result = await teamService.getTeamDetail(teamId, req.user);

        if (result === 'unauthorized')
            return res.status(403).json(ResponseHelper.toErrorResponse(403));
        if (!result)
            return res.status(404).json(ResponseHelper.toErrorResponse(404));
        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

controller.getTeamMemberList = async (req, res, next) => {

    // INVITE / APPLY / MEMBER
    const { page, size, type } = req.query;
    const { teamId } = req.body;
    
    try {

        const result = await teamService.getTeamMemberList(teamId, req.user, parseInt(page), parseInt(size), type.toUpperCase());

        if (result === 'unauthorized')
            return res.status(403).json(ResponseHelper.toErrorResponse(403));
        if (result === 'not admin')
            return res.status(403).json(ResponseHelper.toErrorResponse(403));
        if (result === 'type unaccepted')
            return res.status(400).json(ResponseHelper.toErrorResponse(400));
        if (!result)
            return res.status(404).json(ResponseHelper.toErrorResponse(404));
        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

controller.invite = async (req, res, next) => {

    const { teamId, userIds } = req.body;

    try {

        const result = await teamService.invite(teamId, req.user, userIds);

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

controller.joinTeam = async (req, res, next) => {

    const { teamId } = req.body;
    
    try {

        const result = await teamService.joinTeam(teamId, req.user);

        if (result === 'user already in team')
            return res.status(400).json(ResponseHelper.toErrorResponse(400));
        if (result === 'user already applied')
            return res.status(400).json(ResponseHelper.toErrorResponse(400));
        if (!result)
            return res.status(400).json(ResponseHelper.toErrorResponse(400));
        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

controller.kick = async (req, res, next) => {

    const { teamId, userId } = req.body;

    try {

        const result = await teamService.kick(teamId, req.user, userId);

        if (result === 'cannot kick yourself')
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

controller.changeTeamMemberPosition = async (req, res, next) => {

    const { position } = req.query;
    const { teamId, userId } = req.body;

    try {

        const result = await teamService.invite(teamId, user, userId, position.toUpperCase());

        if (result === 'cannot change your position')
            return res.status(400).json(ResponseHelper.toErrorResponse(400));
        if (result === 'not admin')
            return res.status(403).json(ResponseHelper.toErrorResponse(403));
        if (result === 'position unaccepted')
            return res.status(400).json(ResponseHelper.toErrorResponse(400));
        if (!result)
            return res.status(400).json(ResponseHelper.toErrorResponse(400));
        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

controller.getMembersToInvite = async (req, res, next) => {

    const { teamId, page, size } = req.query;

    try {

        const pageObj = await teamService.getMembersToInvite(teamId, req.user, parseInt(page), parseInt(size));

        return res.status(200).json(ResponseHelper.toPageResponse(pageObj.data, pageObj.paging));
        
    } catch(e) {
        next(e);
    }

}

module.exports = controller