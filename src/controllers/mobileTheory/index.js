const theoryService = require('../../services/mobileTheoryService');
const ResponseHelper = require('../../helper/ResponseHelper');

const controller = {};

controller.getFilesByCompanyId = async (req, res, next) => {

    const { page = '0', size = '10', keyword = '', companyId = null } = req.query;

    try {
        
        const pageObj = await theoryService.getFilesByCompanyId(parseInt(page), parseInt(size), keyword, companyId, req.user);

        return res.status(200).json(ResponseHelper.toPageResponse(pageObj.data, pageObj.paging));

    } catch(e) {
        next(e);
    }

}

module.exports = controller;