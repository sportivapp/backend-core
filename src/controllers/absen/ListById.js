const absenService = require('../../services/absenService');

module.exports = async (req, res, next) => {

    try {

        const { userId } = req.params;
        const user = req.user;

        if (user.permission !== 1) {
            return res.status(401).json({
                data: 'You cannot view list absen by id'
            })
        }

        const absen = await absenService.listAbsenById(userId);

        return res.status(200).json({
            data: absen
        });
        
    } catch (e) {
        next(e);
    }
}