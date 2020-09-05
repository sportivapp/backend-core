const teamService = require('../../services/mobileTeamService');
const ResponseHelper = require('../../helper/ResponseHelper');

const controller = {};

controller.getTeams = async (req, res, next) => {

    const { keyword, page, size } = req.query;
    
    try {

        const pageObj = await teamService.getTeams(keyword, parseInt(page), parseInt(size));

        return res.status(200).json(ResponseHelper.toPageResponse(pageObj.data, pageObj.paging));

    } catch(e) {
        next(e);
    }

}

controller.getTeam = async (req, res, next) => {

    const { teamId } = req.params;
    
    try {

        const result = await teamService.getTeam(teamId, req.user);

        if (!result)
            return res.status(404).json(ResponseHelper.toErrorResponse(404));
        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

controller.createTeam = async (req, res, next) => {

    const { name, companyId, fileId, description, industryIds } = req.body;

    const teamDTO = {
        eteamname: name,
        eteamdescription: description,
        ecompanyecompanyid: companyId,
        efileefileid: fileId
    };

    teamDTO.ecompanyecompanyid = teamDTO.ecompanyecompanyid === 0 ? null : 
    teamDTO.ecompanyecompanyid === undefined ? null : teamDTO.ecompanyecompanyid;

    teamDTO.efileefileid = teamDTO.efileefileid === 0 ? null : 
    teamDTO.efileefileid === undefined ? null : teamDTO.efileefileid;

    try {

        const result = await teamService.createTeam(teamDTO, req.user, industryIds);

        if (!result)
            return res.status(400).json(ResponseHelper.toErrorResponse(400));
        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

controller.updateTeam = async (req, res, next) => {

    const { name, companyId, fileId, description, industryIds } = req.body;
    const { teamId } = req.params;

    const teamDTO = {
        eteamname: name,
        eteamdescription: description,
        ecompanyecompanyid: companyId,
        efileefileid: fileId
    };

    teamDTO.ecompanyecompanyid = teamDTO.ecompanyecompanyid === 0 ? null : 
    teamDTO.ecompanyecompanyid === undefined ? null : teamDTO.ecompanyecompanyid;

    teamDTO.efileefileid = teamDTO.efileefileid === 0 ? null : 
    teamDTO.efileefileid === undefined ? null : teamDTO.efileefileid;

    try {

        const result = await teamService.updateTeam(teamDTO, req.user, teamId, industryIds);

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

controller.exitTeam = async (req, res, next) => {

    const { teamId } = req.body;
    
    try {

        const result = await teamService.exitTeam(teamId, req.user);

        if (result === 'user not in team')
            return res.status(400).json(ResponseHelper.toErrorResponse(400));
        if (!result)
            return res.status(400).json(ResponseHelper.toErrorResponse(400));
        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

controller.cancelInvite = async (req, res, next) => {

    const { teamId, userId } = req.body;
    
    try {

        const result = await teamService.exitTeam(teamId, userId, req.user);

        if (result === 'not admin')
            return res.status(403).json(ResponseHelper.toErrorResponse(403));
        if (result === 'user not invited')
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

controller.getTeamMemberList = async (req, res, next) => {

    // INVITE / APPLY / MEMBER
    const { page, size, type } = req.query;
    const { teamId } = req.body;
    
    try {

        const pageObj = await teamService.getTeamMemberList(teamId, req.user, parseInt(page), parseInt(size), type.toUpperCase());

        if (pageObj === 'type unaccepted')
            return res.status(400).json(ResponseHelper.toErrorResponse(400));
        if (!pageObj)
            return res.status(404).json(ResponseHelper.toErrorResponse(404));
        return res.status(200).json(ResponseHelper.toPageResponse(pageObj.data, pageObj.paging));

    } catch(e) {
        next(e);
    }

}

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

controller.changeTeamMemberPosition = async (req, res, next) => {

    const { position } = req.query;
    const { teamId, userId } = req.body;

    try {

        const result = await teamService.changeTeamMemberPosition(teamId, user, userId, position.toUpperCase());

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

controller.cancelRequest = async (req, res, next) => {

    const { teamId } = req.body;

    try {

        const result = await teamService.cancelRequest(teamId, req.user);

        if (result === 'user not applied')
            return res.status(400).json(ResponseHelper.toErrorResponse(400));
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

module.exports = controller;