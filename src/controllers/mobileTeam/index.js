const teamService = require('../../services/mobileTeamService');
const ResponseHelper = require('../../helper/ResponseHelper');

const controller = {};

controller.getTeams = async (req, res, next) => {

    const { page = '0', size = '10', keyword = '' } = req.query;
    
    try {

        const pageObj = await teamService.getTeams(parseInt(page), parseInt(size), keyword.toLowerCase());

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

    const { name, fileId, description, industryId, isPublic, stateId, countryId } = req.body;

    const teamDTO = {
        eteamname: name,
        eteamdescription: description,
        efileefileid: fileId,
        eindustryeindustryid: industryId,
        eteamispublic: isPublic
    };

    teamDTO.efileefileid = teamDTO.efileefileid === 0 ? null : 
    teamDTO.efileefileid === undefined ? null : teamDTO.efileefileid;

    const addressDTO = {
        eaddressstreet: '',
        ecountryecountryid: countryId,
        estateestateid: stateId
    }

    try {

        const result = await teamService.createTeam(teamDTO, addressDTO, req.user);

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

    teamDTO.efileefileid = teamDTO.efileefileid === 0 ? null : 
    teamDTO.efileefileid === undefined ? null : teamDTO.efileefileid;

    const addressDTO = {
        eaddressstreet: '',
        ecountryecountryid: countryId,
        estateestateid: stateId
    }

    try {

        const result = await teamService.updateTeam(parseInt(teamId), teamDTO, addressDTO, req.user);

        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

controller.deleteTeam = async (req, res, next) => {

    const { teamId } = req.params;

    try {

        const result = await teamService.deleteTeam(parseInt(teamId), req.user);

        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

controller.getMyTeams = async (req, res, next) => {

    const { page = '0', size = '10', keyword = '' } = req.query;

    try {

        const pageObj = await teamService.getMyTeams(parseInt(page), parseInt(size), keyword.toLowerCase(), req.user);

        return res.status(200).json(ResponseHelper.toPageResponse(pageObj.data, pageObj.paging));

    } catch(e) {
        next(e);
    }

}

module.exports = controller;