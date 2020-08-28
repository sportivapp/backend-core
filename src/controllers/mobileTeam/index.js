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

    const { name, companyId, fileId, address, phoneNumber, email } = req.body;

    const teamDTO = {
        eteamname: name,
        eteamaddress: address,
        eteamphonenumber: phoneNumber,
        eteamemail: email,
        ecompanyecompanyid: companyId,
        efileefileid: fileId
    };

    teamDTO.ecompanyecompanyid = teamDTO.ecompanyecompanyid === 0 ? null : teamDTO.ecompanyecompanyid;
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

controller.joinTeam = async (req, res, next) => {

    const { teamId } = req.body;
    
    try {

        const result = await teamService.joinTeam(teamId, req.user);

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
    const { type } = req.query;
    
    try {

        const result = await teamService.getTeamMemberList(req.user, type.toUpperCase());

        if (!result)
            return res.status(404).json(ResponseHelper.toErrorResponse(404));
        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

controller.invite = async (req, res, next) => {

    const { email } = req.body;

    try {

        const result = await teamService.invite(req.user, email);

        if (!result)
            return res.status(400).json(ResponseHelper.toErrorResponse(400));
        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

module.exports = controller;