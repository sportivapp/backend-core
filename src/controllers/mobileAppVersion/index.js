const mobileAppVersionService = require('../../services/mobileAppVersionService');
const ResponseHelper = require('../../helper/ResponseHelper');

const controller = {};

controller.getVersion = async (req, res, next) => {
    
    try {

        const result = await mobileAppVersionService.getVersion();

        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

module.exports = controller