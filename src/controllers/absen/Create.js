const absenService = require('../../services/absenService');
const ResponseHelper = require('../../helper/ResponseHelper')


module.exports = async (req, res, next) => {

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

        const result = await absenService.createAbsenByPOS(absenDTO, imageDTO, locationDTO);

        if (!result)
            return res.status(400).json(ResponseHelper.toErrorResponse(400))
        return res.status(200).json(ResponseHelper.toBaseResponse(result))

    } catch (e) {
        next(e);
    }
}