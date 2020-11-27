const companyLogService = require('../../../services/companyLogService');
const ResponseHelper = require('../../../helper/ResponseHelper');

const controller = {};

controller.joinCompany = async (req, res, next) => {

    const { companyId } = req.body;

    return companyLogService.joinCompany(companyId, req.user)
        .then(ResponseHelper.toBaseResponse)
        .then(response => res.status(200).json(response))
        .catch(next);

}

controller.userCancelJoins = async (req, res, next) => {

    const { companyLogIds } = req.body

    return companyLogService.userCancelJoins(companyLogIds, req.user)
        .then(result => ResponseHelper.toBaseResponse(result))
        .then(response => res.status(200).json(response))
        .catch(next);

}

controller.processInvitations = async (req, res, next) => {

    const { companyLogIds, status } = req.body;

    return companyLogService.processInvitation(companyLogIds, req.user, status.toUpperCase())
        .then(result => ResponseHelper.toBaseResponse(result))
        .then(response => res.status(200).json(response))
        .catch(next);

}

module.exports = controller;