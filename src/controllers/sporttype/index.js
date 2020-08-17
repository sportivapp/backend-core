const sporttypeService = require('../../services/sporttypeService');
const ResponseHelper = require('../../helper/ResponseHelper');

const controller = {};

controller.getSportTypes = async (req, res, next) => {

    try {
        const result = await sporttypeService.getSportTypes();

        return res.status(200).json(ResponseHelper.toBaseResponse(result));
    } catch(e) {
        next(e);
    }

}

module.exports = controller;