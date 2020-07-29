const absenService = require('../../services/absenService');

module.exports = async (req, res, next) => {

    try {

        const user = req.user;

        if (user.permission !== 1) {
            return res.status(401).json({
                data: 'You cannot delete absen'
            })
        }

        const { absenId } = req.params;

        const isDeleted = await absenService.deleteAbsen(absenId, user.sub);

        const data = {
            isDeleted: (isDeleted) ? true : false,
            message: (isDeleted) ? "Successfully delete absen!" : "Failed to delete absen!"
        }

        return res.status(200).json({
            data: data
        });

    } catch(e) {
        next(e);
    }

}