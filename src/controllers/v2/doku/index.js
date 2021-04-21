//FILE TO DELETE IF PAYMENT SEPARATED
const dokuService = require("../../../services/v2/dokuService");
const ResponseHelper = require('../../../helper/ResponseHelper');

const dokuController = {};

dokuController.notifyDokuRequest = async (req, res, next) => {

    const dokuNotify = req.body;

    try {

        const result = await dokuService.notifyRequest(dokuNotify);
        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

module.exports = dokuController;