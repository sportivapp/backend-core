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

        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

controller.createTeam = async (req, res, next) => {

    const { name, fileId, description, industryId, isPublic } = req.body;

    const teamDTO = {
        eteamname: name,
        eteamdescription: description,
        efileefileid: fileId,
        eindustryeindustryid: industryId,
        eteamispublic: isPublic
    };

    teamDTO.efileefileid = teamDTO.efileefileid === 0 ? null : 
    teamDTO.efileefileid === undefined ? null : teamDTO.efileefileid;

    try {

        const result = await teamService.createTeam(teamDTO, req.user);

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

    teamDTO.efileefileid = teamDTO.efileefileid === 0 ? null : 
    teamDTO.efileefileid === undefined ? null : teamDTO.efileefileid;

    try {

        const result = await teamService.updateTeam(teamDTO, req.user, parseInt(teamId));

        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

controller.processRequest = async (req, res, next) => {

    const { teamId, userId } = req.params;
    const { status } = req.query;
    
    try {

        const result = await teamService.processRequest(teamId, userId, req.user, status.toUpperCase());

        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

controller.cancelRequest = async (req, res, next) => {

    const { teamId } = req.params;

    try {

        const result = await teamService.cancelRequest(teamId, req.user);

        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

controller.getPendingTeamList = async (req, res, next) => {

    const { page = '0', size = '10', type } = req.query;

    try {

        const pageObj = await teamService.getPendingTeamList(req.user, parseInt(page), parseInt(size), type.toUpperCase());

        return res.status(200).json(ResponseHelper.toPageResponse(pageObj.data, pageObj.paging));

    } catch(e) {
        next(e);
    }

}

controller.processInvitation = async (req, res, next) => {

    const { teamId } = req.params;
    const { status } = req.query;

    try {

        const result = await teamService.processInvitation(teamId, req.user, status.toUpperCase());

        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

module.exports = controller;