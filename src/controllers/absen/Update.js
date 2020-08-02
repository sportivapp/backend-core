const ResponseHelper = require('../../helper/ResponseHelper')
const absenService = require('../../services/absenService');

module.exports = async (req, res, next) => {

    const user = req.user;
    const { absenId } = req.params;
    const { locationAccuracy, absenStatus, absenDescription } = req.body;

    if (user.permission !== 1){
        return res.status(401).json({
            data: 'You cannot update absen'
        })
    }

    try {

        const absenDTO = {
            eabsenlocationdistanceaccuracy: locationAccuracy,
            eabsenstatus: absenStatus,
            eabsendescription: absenDescription,
            eabseneditby: user.sub,
            eabsenedittime: new Date(Date.now())
        }

        const result = await absenService.editAbsen(absenId, absenDTO);

        if (!result)
            return res.status(400).json(ResponseHelper.toErrorResponse(400))
        return res.status(200).json(ResponseHelper.toBaseResponse(result))

    } catch (e) {
        next(e);
    }
}