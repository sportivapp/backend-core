const absenService = require('../../services/absenService');
const ResponseHelper = require('../../helper/ResponseHelper')

absenController = {}

absenController.createAbsenByPOS = async (req, res, next) => {

    const { absenTime, fileId, deviceImei, userId } = req.body;

    try {

        const result = await absenService.createAbsenByPOS(absenTime, deviceImei, fileId, userId);

        if (!result)
            return res.status(400).json(ResponseHelper.toErrorResponse(400))
        return res.status(200).json(ResponseHelper.toBaseResponse(result))

    } catch (e) {
        next(e);
    }
}

absenController.deleteAbsen = async (req, res, next) => {

    const user = req.user;
    const { absenId } = req.params;

    try {

        const result = await absenService.deleteAbsen(absenId, user);

        if (!result)
            return res.status(400).json(ResponseHelper.toErrorResponse(400))
        return res.status(200).json(ResponseHelper.toBaseResponse(result))

    } catch(e) {
        next(e);
    }

}

absenController.listAbsen = async (req, res, next) => {
    
    const { page, size, userId } = req.query

    try {

        const pageObj = await absenService.listAbsen(parseInt(page), parseInt(size), userId);
        return res.status(200).json(ResponseHelper.toBaseResponse(pageObj.data, pageObj.paging))
        
    } catch (e) {
        next(e);
    }
}

absenController.editAbsen = async (req, res, next) => {

    const user = req.user;
    const { absenId } = req.params;
    const { locationAccuracy, absenStatus, absenDescription } = req.body;

    try {

        const absenDTO = {
            eabsenlocationdistanceaccuracy: locationAccuracy,
            eabsenstatus: absenStatus,
            eabsendescription: absenDescription
        }

        const result = await absenService.editAbsen(absenId, absenDTO, user);

        if (!result)
            return res.status(400).json(ResponseHelper.toErrorResponse(400))
        return res.status(200).json(ResponseHelper.toBaseResponse(result))

    } catch (e) {
        next(e);
    }
}

module.exports = absenController;