const mobileAppVersionService = require('../../services/mobileAppVersionService');
const ResponseHelper = require('../../helper/ResponseHelper');

const controller = {};

controller.getVersion = async (req, res, next) => {
    
    const { version } = req.query;

    try {

        const result = await mobileAppVersionService.getVersion(version);

        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

module.exports = controller