const classService = require('../../../services/v2/landingClassService');
const ResponseHelper = require('../../../helper/ResponseHelper');

const classController = {};

classController.getClasses = async (req, res, next) => {

    const { page='0', size='10', keyword='', industryId, cityId, companyId } = req.query;

    try {

        const pageObj = await classService.getClasses(parseInt(page), parseInt(size), keyword, 
            parseInt(industryId), parseInt(cityId), parseInt(companyId));
        return res.status(200).json(ResponseHelper.toPageResponse(pageObj.data, pageObj.paging));

    } catch(e) {
        next(e);
    }

}

module.exports = classController;