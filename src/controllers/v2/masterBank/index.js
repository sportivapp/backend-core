const masterBankService = require('../../../services/v2/masterBankService');
const ResponseHelper = require('../../../helper/ResponseHelper');

const masterBankController = {};

masterBankController.getAllBanks = async (req, res, next) => {

    try {

        const result = await masterBankService.getAllBanks();
        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

module.exports = masterBankController;