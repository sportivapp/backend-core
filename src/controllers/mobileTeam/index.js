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

module.exports = controller;