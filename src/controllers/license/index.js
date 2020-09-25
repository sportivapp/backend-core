const licenseService = require('../../services/licenseService');
const ResponseHelper = require('../../helper/ResponseHelper');

const controller = {};

controller.getLicenseById = async (req, res, next) => {

    const { licenseId } = req.params
    const { userId, companyId } = req.body

    try {

        const result = await licenseService.getLicenseById(parseInt(licenseId), userId, companyId);

        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

module.exports = controller