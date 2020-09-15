const theoryService = require('../../services/theoryService');
const ResponseHelper = require('../../helper/ResponseHelper');

const controller = {};

controller.getTheoryList = async (req, res, next) => {

    const { keyword = '', companyId = null, page = '0', size = '100' } = req.query
    
    try {

        const pageObj = await theoryService.getTheoryList(keyword, parseInt(page), parseInt(size), companyId, req.user);

        return res.status(200).json(ResponseHelper.toPageResponse(pageObj.data, pageObj.paging))

    } catch(e) {
        next(e);
    }

}

module.exports = controller;