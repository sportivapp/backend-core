const absenService = require('../../services/absenService');

module.exports = async (req, res, next) => {

    try {
        const user = req.user;
        const { locationAccuracy, absenStatus, absenDescription } = req.body;

        if (user.permission !== 1){
            return res.status(401).json({
                data: 'You cannot view absen'
            })
        }

        const absenDTO = {
            eabsenlocationdistanceaccuracy: locationAccuracy,
            eabsenstatus: absenStatus,
            eabsendescription: absenDescription,
            eabsencreateby: user.sub,
            eusereuserid: user.sub
        }

        const absen = await absenService.createAbsen(absenDTO);

        return res.status(200).json({
            data: absen
        })

    } catch (e) {
        next(e);
    }
}