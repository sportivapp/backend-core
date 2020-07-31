const absenService = require('../../services/absenService');
const AbsenService = require('../../services/absenService');

module.exports = async (req, res, next) => {

    try {
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

        const location = await AbsenService.createLocation(locationDTO);

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

        const absen = await absenService.createAbsenByPOS(absenDTO, imageDTO, locationDTO);

        return res.status(200).json({
            absen: absen,
            location: location
        })

    } catch (e) {
        next(e);
    }
}