const disbursementService = require('../../../services/v2/disbursementService');
const ResponseHelper = require('../../../helper/ResponseHelper');

const disbursementController = {};

disbursementController.getMyDisbursementAmount = async (req, res, next) => {

    try {

        const result = await disbursementService.getMyDisbursementAmount(req.user.sub);
        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

module.exports = disbursementController;