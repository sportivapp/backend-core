const absenService = require('../../services/absenService');
const ResponseHelper = require('../../helper/ResponseHelper')

absenController = {}

absenController.createAbsenByPOS = async (req, res, next) => {

    const { locationAccuracy, absenTime, absenStatus, absenDescription, imageFile, imageType, deviceId, userId } = req.body;
        
    const locationDTO = {
        elocationcode: 'tay',
        elocationname: 'tay house',
        elocationdescription: 'This is tay house',
        elocationlongitude: '-1',
        elocationlatitude: '-2',
        elocationaddress: 'Jl. santuy 10 nomor 1',
        elocationcreateby: userId,
        edeviceedeviceid: deviceId
    }

    const location = await absenService.createLocation(locationDTO);

    const absenDTO = {
        eabsenlocationdistanceaccuracy: locationAccuracy,
        eabsentime: absenTime,
        eabsenstatus: absenStatus,
        eabsendescription: absenDescription,
        eabsencreateby: userId,
        eusereuserid: userId,
        elocationelocationid: location.elocationid
    }

    const imageDTO = {
        eimagefile: imageFile,
        eimagetype: imageType,
        eimagecreateby: userId,
        eusereuserid: userId
    }

    try {

        const result = await absenService.createAbsenByPOS(absenDTO, imageDTO);

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
    
    const { page, size } = req.query

    try {

        const pageObj = await absenService.listAbsen(parseInt(page), parseInt(size));
        if(!pageObj)
            return res.status(400).json(ResponseHelper.toErrorResponse(400))
        return res.status(200).json(ResponseHelper.toBaseResponse(pageObj.data, pageObj.paging))
        
    } catch (e) {
        next(e);
    }
}

absenController.listAbsenById = async (req, res, next) => {

    const { page, size } = req.query
    const { userId } = req.params

    try {

        const pageObj = await absenService.listAbsenById(parseInt(page), parseInt(size), userId);

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