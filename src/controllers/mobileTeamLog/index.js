const teamLogService = require('../../services/mobileTeamLogService');
const teamService = require('../../services/mobileTeamService');
const ResponseHelper = require('../../helper/ResponseHelper');

const controller = {};

controller.applyTeam = async (req, res, next) => {

    const { teamId } = req.params;
    
    try {

        const result = await teamService.applyTeam(parseInt(teamId), req.user);

        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        console.log(e)
        next(e);
    }

}

controller.cancelRequest = async (req, res, next) => {

    const { teamLogId } = req.params;

    try {

        const result = await teamLogService.cancelRequest(parseInt(teamLogId), req.user);

        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

controller.processRequest = async (req, res, next) => {

    const { teamLogId } = req.params;
    const { status } = req.query;
    
    try {

        const result = await teamLogService.processRequest(parseInt(teamLogId), req.user, status.toUpperCase());

        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

controller.getPendingTeamLogs = async (req, res, next) => {

    const { teamId } = req.params;
    const { page = '0', size = '10', type = 'APPLY' } = req.query;

    try {

        const pageObj = await teamLogService.getPendingTeamLogs(parseInt(teamId), parseInt(page), parseInt(size), type.toUpperCase(), req.user);

        return res.status(200).json(ResponseHelper.toPageResponse(pageObj.data, pageObj.paging));

    } catch(e) {
        next(e);
    }

}

controller.getPendingUserLogs = async (req, res, next) => {

    const { teamId } = req.params;
    const { page = '0', size = '10', type = 'APPLY' } = req.query;

    try {

        const pageObj = await teamLogService.getPendingUserLogs(parseInt(teamId), parseInt(page), parseInt(size), type.toUpperCase(), req.user);

        return res.status(200).json(ResponseHelper.toPageResponse(pageObj.data, pageObj.paging));

    } catch(e) {
        next(e);
    }

}

controller.invite = async (req, res, next) => {

    const { teamId } = req.params;
    const { email } = req.body;

    try {

        const result = await teamLogService.invite(parseInt(teamId), req.user, email);

        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

controller.cancelInvite = async (req, res, next) => {

    const { teamLogId } = req.params;
    
    try {

        const result = await teamLogService.cancelInvite(parseInt(teamLogId), req.user);

        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

controller.processInvitation = async (req, res, next) => {

    const { teamLogId } = req.params;
    const { status } = req.query;

    try {

        const result = await teamLogService.processInvitation(parseInt(teamLogId), req.user, status.toUpperCase());

        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

module.exports = controller;