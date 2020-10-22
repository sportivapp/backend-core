const teamService = require('../../services/teamService');
const ResponseHelper = require('../../helper/ResponseHelper');

const controller = {};

controller.createTeam = async (req, res, next) => {

    const { name, fileId, description, industryId, isPublic, stateId, countryId } = req.body;

    const teamDTO = {
        eteamname: name,
        eteamdescription: description,
        ecompanyecompanyid: req.user.companyId,
        efileefileid: fileId,
        eindustryeindustryid: industryId,
        eteamispublic: isPublic
    };
    
    teamDTO.efileefileid = ( !teamDTO.efileefileid || teamDTO.efileefileid === 0 ) ? null : teamDTO.efileefileid;

    const addressDTO = {
        eaddressstreet: '',
        estateestateid: stateId,
        ecountryecountryid: countryId
    }

    try {

        const result = await teamService.createTeam(teamDTO, addressDTO, req.user);
        if (!result)
            return res.status(400).json(ResponseHelper.toErrorResponse(400));
        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

controller.updateTeam = async (req, res, next) => {

    const { name, fileId, description, industryId, isPublic, stateId, countryId } = req.body;
    const { teamId } = req.params;

    const teamDTO = {
        eteamname: name,
        eteamdescription: description,
        efileefileid: fileId,
        eindustryeindustryid: industryId,
        eteamispublic: isPublic
    };

    teamDTO.efileefileid = ( !teamDTO.efileefileid || teamDTO.efileefileid === 0 ) ? null : teamDTO.efileefileid;

    const addressDTO = {
        eaddressstreet: '',
        estateestateid: stateId,
        ecountryecountryid: countryId
    }

    try {

        const result = await teamService.updateTeam(teamId, teamDTO, addressDTO, req.user);

        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

controller.getMyTeamList = async (req, res, next) => {

    const { page = '0', size = '10', keyword = '' } = req.query;
    
    try {

        const pageObj = await teamService.getMyTeamList(parseInt(page), parseInt(size), keyword.toLowerCase(), req.user);
        return res.status(200).json(ResponseHelper.toPageResponse(pageObj.data, pageObj.paging))

    } catch(e) {
        next(e);
    }

}

controller.getTeams = async (req, res, next) => {

    const { keyword = '', page = '0', size = '10' } = req.query;
    
    try {

        const pageObj = await teamService.getTeams(keyword.toLowerCase(), parseInt(page), parseInt(size), req.user);
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

    const { page = '0', size = '10', keyword = '' } = req.query;
    const { teamId } = req.params;
    
    try {

        const pageObj = await teamService.getTeamMemberList(parseInt(teamId), req.user, parseInt(page), parseInt(size), keyword.toLowerCase());

        return res.status(200).json(ResponseHelper.toPageResponse(pageObj.data, pageObj.paging));

    } catch(e) {
        next(e);
    }

}

controller.getTeamMemberByLogType = async (req, res, next) => {

    // INVITE / APPLY
    const { page = '0', size = '10', type } = req.query;
    const { teamId } = req.params;
    
    try {

        const pageObj = await teamService.getTeamMemberByLogType(parseInt(teamId), req.user, parseInt(page), parseInt(size), type.toUpperCase());

        return res.status(200).json(ResponseHelper.toPageResponse(pageObj.data, pageObj.paging));

    } catch(e) {
        next(e);
    }

}

controller.getUserTeamPendingListByLogType = async (req, res, next) => {

    // INVITE / APPLY
    const { page = '0', size = '10', type = 'APPLY' } = req.query;
    
    try {

        const pageObj = await teamService.getUserTeamPendingListByLogType(parseInt(page), parseInt(size), type.toUpperCase(), req.user);

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

controller.cancelInvites = async (req, res, next) => {

    const { teamLogIds } = req.body;
    
    try {

        const result = await teamService.cancelInvites(teamLogIds, req.user);

        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

controller.processRequests = async (req, res, next) => {

    const { teamLogIds } = req.body;
    const { status } = req.query;
    
    try {

        const result = await teamService.processRequests(teamLogIds, req.user, status.toUpperCase());

        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

controller.cancelRequests = async (req, res, next) => {

    const { teamLogIds } = req.body;

    try {

        const result = await teamService.cancelRequests(teamLogIds, req.user);

        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

controller.processInvitations = async (req, res, next) => {

    const { teamLogIds } = req.body;
    const { status } = req.query;

    try {

        const result = await teamService.processInvitations(teamLogIds, req.user, status.toUpperCase());

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

    const { teamId, userId, message = '' } = req.body;

    try {

        const result = await teamService.kickUserFromTeam(teamId, req.user, userId, message);

        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

controller.changeTeamMemberSportRoles = async (req, res, next) => {

    const { teamUserMappingId, sportRoleIds } = req.body;

    try {

        const result = await teamService.changeTeamMemberSportRoles(teamUserMappingId, req.user, sportRoleIds);

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

    const { teamId, page = '0', size ='10' } = req.query;

    try {

        const pageObj = await teamService.getMembersToInvite(parseInt(teamId), req.user, parseInt(page), parseInt(size));

        return res.status(200).json(ResponseHelper.toPageResponse(pageObj.data, pageObj.paging));
        
    } catch(e) {
        next(e);
    }

}

controller.deleteTeam = async (req, res, next) => {

    const { teamId } = req.params;
    
    try {

        const result = await teamService.deleteTeam(teamId, req.user);

        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

module.exports = controller