const classService = require('../../../services/v2/classService');
const ResponseHelper = require('../../../helper/ResponseHelper');

const classController = {};

classController.createClass = async (req, res, next) => {

    const { title, description, address, cityId, industryId, picName, picMobileNumber, administrationFee } = req.body;
    const { fileIds } = req.body;
    const { classCoachUserIds } = req.body;
    const { categories } = req.body;
    const { categoryCoachUserIds } = req.body;

    const classDTO = {
        title: title,
        description: description,
        address: address,
        cityId: cityId,
        industryId: industryId,
        picName: picName,
        picMobileNumber: picMobileNumber,        
        companyId: req.user.companyId,
        administrationFee: administrationFee,
    };

    try {

        const result = await classService.createClass(classDTO, fileIds, classCoachUserIds, categories, req.user);
        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        console.log(e);
        next(e);
    }

}

module.exports = classController;