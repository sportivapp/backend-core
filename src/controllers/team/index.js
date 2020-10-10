const teamService = require('../../services/teamService');
const ResponseHelper = require('../../helper/ResponseHelper');

const controller = {};

controller.createTeam = async (req, res, next) => {

    const { name, fileId, description, industryId, isPublic  } = req.body;

    const teamDTO = {
        eteamname: name,
        eteamdescription: description,
        ecompanyecompanyid: req.user.companyId,
        efileefileid: fileId,
        eindustryeindustryid: industryId,
        eteamispublic: isPublic
    };

    teamDTO.ecompanyecompanyid = ( !teamDTO.ecompanyecompanyid || teamDTO.ecompanyecompanyid === 0 ) ? null : teamDTO.ecompanyecompanyid;
    teamDTO.efileefileid = ( !teamDTO.efileefileid || teamDTO.efileefileid === 0 ) ? null : teamDTO.efileefileid;

    try {

        const result = await teamService.createTeam(teamDTO, req.user);
        if (!result)
            return res.status(400).json(ResponseHelper.toErrorResponse(400));
        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

controller.updateTeam = async (req, res, next) => {

    const { name, fileId, description, industryId, isPublic } = req.body;
    const { teamId } = req.params;

    const teamDTO = {
        eteamname: name,
        eteamdescription: description,
        efileefileid: fileId,
        eindustryeindustryid: industryId,
        eteamispublic: isPublic
    };

    teamDTO.efileefileid = ( !teamDTO.efileefileid || teamDTO.efileefileid === 0 ) ? null : teamDTO.efileefileid;

    try {

        const result = await teamService.updateTeam(teamDTO, req.user, teamId);

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

        return res.status(200).json(ResponseHelper.toPageResponse(pageObj.data, pageObj.paging));

    } catch(e) {
        next(e);
    }

}

controller.invite = async (req, res, next) => {

    const { teamId, userIds } = req.body;

    try {

        const result = await teamService.invite(teamId, req.user, userIds);

        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

controller.cancelInvite = async (req, res, next) => {

    const { teamId, userId } = req.body;
    
    try {

        const result = await teamService.cancelInvite(teamId, userId, req.user);

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

        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

controller.cancelRequest = async (req, res, next) => {

    const { teamId } = req.body;

    try {

        const result = await teamService.cancelRequest(teamId, req.user);

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

        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

controller.joinTeam = async (req, res, next) => {

    const { teamId } = req.body;
    
    try {

        const result = await teamService.joinTeam(teamId, req.user);

        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

controller.exitTeam = async (req, res, next) => {

    const { teamId } = req.body;
    
    try {

        const result = await teamService.exitTeam(teamId, req.user);

        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

controller.kickUserFromTeam = async (req, res, next) => {

    const { teamId, userId } = req.body;

    try {

        const result = await teamService.kickUserFromTeam(teamId, req.user, userId);

        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

controller.changeTeamMemberPosition = async (req, res, next) => {

    const { position } = req.query;
    const { teamId, userId } = req.body;

    try {

        const result = await teamService.changeTeamMemberPosition(teamId, req.user, userId, position.toUpperCase());

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