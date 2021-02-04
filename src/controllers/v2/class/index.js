const classService = require('../../../services/v2/classService');
const ResponseHelper = require('../../../helper/ResponseHelper');

const classController = {};

classController.createClass = async (req, res, next) => {

    const { title, description, address, cityId, industryId, picName, picMobileNumber } = req.body;
    const { fileIds } = req.body;
    const { classCompanyUserIds } = req.body;
    const { categories } = req.body;
    const { classCategoryCompanyUserIds } = req.body;

    const classDTO = {
        title: title,
        description: description,
        address: address,
        cityId: cityId,
        industryId: industryId,
        picName: picName,
        picMobileNumber: picMobileNumber,        
        companyId: req.user.companyId,
    };

    try {

        const result = await classService.createClass(classDTO, fileIds, classCompanyUserIds, categories, 
            classCategoryCompanyUserIds, req.user);
        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

module.exports = classController;