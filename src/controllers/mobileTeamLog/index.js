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

controller.cancelRequests = async (req, res, next) => {

    const { teamLogIds } = req.body;

    try {

        const result = await teamLogService.cancelRequests(teamLogIds, req.user);

        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

controller.processRequests = async (req, res, next) => {

    const { teamLogIds } = req.body;
    const { status } = req.query;
    
    try {

        const result = await teamLogService.processRequests(teamLogIds, req.user, status.toUpperCase());

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

    const { page = '0', size = '10', type = 'APPLY' } = req.query;

    try {

        const pageObj = await teamLogService.getPendingUserLogs(parseInt(page), parseInt(size), type.toUpperCase(), req.user);

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

controller.cancelInvites = async (req, res, next) => {

    const { teamLogIds } = req.body;
    
    try {

        const result = await teamLogService.cancelInvites(teamLogIds, req.user);

        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

controller.processInvitations = async (req, res, next) => {

    const { status } = req.query;
    const { teamLogIds } = req.body;

    try {

        const result = await teamLogService.processInvitations(teamLogIds, req.user, status.toUpperCase());

        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

module.exports = controller;