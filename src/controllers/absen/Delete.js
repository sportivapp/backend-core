const ResponseHelper = require('../../helper/ResponseHelper')
const absenService = require('../../services/absenService');

module.exports = async (req, res, next) => {

    const user = req.user;
    const { absenId } = req.params;

    if (user.permission !== 1) {
        return res.status(401).json({
            data: 'You cannot delete absen'
        })
    }

    try {

        const result = await absenService.deleteAbsen(absenId, user.sub);

        if (!result)
            return res.status(400).json(ResponseHelper.toErrorResponse(400))
        return res.status(200).json(ResponseHelper.toBaseResponse(result))

    } catch(e) {
        next(e);
    }

}