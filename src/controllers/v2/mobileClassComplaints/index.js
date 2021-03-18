const classComplaintsService = require('../../../services/v2/mobileClassComplaintsService');
const ResponseHelper = require('../../../helper/ResponseHelper');

mobileClassComplaintController = {};

mobileClassComplaintController.getMyComplaints = async (req, res, next) => {

    try {

        const result = await classComplaintsService.getMyComplaints(req.user);
        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

mobileClassComplaintController.getCoachComplaints = async (req, res, next) => {

    try {

        const result = await classComplaintsService.getCoachComplaints(req.user);
        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

module.exports = mobileClassComplaintController;