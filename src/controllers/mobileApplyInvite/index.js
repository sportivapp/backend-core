const applyInviteService = require('../../services/mobileApplyInviteService');
const ResponseHelper = require('../../helper/ResponseHelper');

const controller = {};

controller.getApplyInvite = async (req, res, next) => {

    // INVITE / APPLY
    const { type } = req.query;
    
    try {

        const result = await applyInviteService.getApplyInvite(req.user, type.toUpperCase());

        if (!result)
            return res.status(404).json(ResponseHelper.toErrorResponse(404));
        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

controller.joinRequest = async (req, res, next) => {

    const { companyId } = req.body;

    try {

        const result = await applyInviteService.joinRequest(companyId, req.user);

        if (!result)
            return res.status(400).json(ResponseHelper.toErrorResponse(400));
        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

controller.cancelJoinRequest = async (req, res, next) => {

    const { companyId } = req.body;

    try {

        const result = await applyInviteService.cancelJoinRequest(companyId, req.user);

        if (!result)
            return res.status(400).json(ResponseHelper.toErrorResponse(400));
        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

controller.processInvite = async (req, res, next) => {

    const { companyId } = req.body;
    const { status } = req.query;

    try {

        const result = await applyInviteService.processInvitation(companyId, req.user, status.toUpperCase());

        if (!result)
            return res.status(400).json(ResponseHelper.toErrorResponse(400));
        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

module.exports = controller;