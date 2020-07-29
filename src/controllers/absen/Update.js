const absenService = require('../../services/absenService');

module.exports = async (req, res, next) => {

    try {
        const user = req.user;
        const { locationAccuracy, absenStatus, absenDescription } = req.body;

        if (user.permission !== 1){
            return res.status(401).json({
                data: 'You cannot update absen'
            })
        }

        const { absenId } = req.params;

        const absenDTO = {
            eabsenlocationdistanceaccuracy: locationAccuracy,
            eabsenstatus: absenStatus,
            eabsendescription: absenDescription,
            eabseneditby: user.sub,
            eabsenedittime: new Date(Date.now())
        }

        const isUpdated = await absenService.editAbsen(absenId, absenDTO);

        const data = {
            isUpdated: (isUpdated) ? true : false,
            message: (isUpdated) ? "Successfully update absen!" : "Failed to update absen!"
        }

        return res.status(200).json({
            data: data
        })

    } catch (e) {
        next(e);
    }
}