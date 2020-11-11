const theoryService = require('../../services/mobileTheoryService');
const ResponseHelper = require('../../helper/ResponseHelper');

const controller = {};

controller.getFilesByCompanyId = async (req, res, next) => {

    const { page = '0', size = '10', keyword = '', companyId = null } = req.query;

    try {
        
        const result = await theoryService.getFilesByCompanyId(parseInt(page), parseInt(size), keyword, companyId, req.user);

        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

module.exports = controller;