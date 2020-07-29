const absenService = require('../../services/absenService');

module.exports = async (req, res, next) => {

    try {

        const user = req.user;

        if (user.permission !== 1) {
            return res.status(401).json({
                data: 'You cannot view list absen'
            })
        }

        const absen = await absenService.listAbsen();

        return res.status(200).json({
            data: absen
        });
        
    } catch (e) {
        next(e);
    }
}