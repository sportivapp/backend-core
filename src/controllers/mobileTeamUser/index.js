const teamUserService = require('../../services/mobileTeamUserService');
const ResponseHelper = require('../../helper/ResponseHelper');

const controller = {};

controller.exitTeam = async (req, res, next) => {

    const { teamId } = req.params;
    
    try {

        const result = await teamUserService.exitTeam(parseInt(teamId), req.user);

        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

controller.getTeamMemberList = async (req, res, next) => {

    // INVITE / APPLY / MEMBER
    // const { page, size, type } = req.query;
    const { page = '0', size = '10' } = req.query;
    const { teamId } = req.params;
    
    try {

        const pageObj = await teamUserService.getTeamMemberList(parseInt(teamId), parseInt(page), parseInt(size));

        return res.status(200).json(ResponseHelper.toPageResponse(pageObj.data, pageObj.paging));

    } catch(e) {
        next(e);
    }

}

controller.changeTeamMemberPosition = async (req, res, next) => {

    const { teamId, position } = req.params;
    const { userId } = req.body;

    try {

        const result = await teamUserService.changeTeamMemberPosition(parseInt(teamId), userId, req.user, position.toUpperCase());

        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

controller.kickMember = async (req, res, next) => {

    const { teamId } = req.params;
    const { userId } = req.body;

    try {

        const result = await teamUserService.kickMember(parseInt(teamId), userId, req.user);

        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

controller.isAdmin = async (req, res, next) => {

    const { teamId } = req.params;

    try {
         
        const result = await teamUserService.getTeamUserCheckAdmin(teamId, req.user.sub);

        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

module.exports = controller;