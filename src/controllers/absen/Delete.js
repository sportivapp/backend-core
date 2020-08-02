const ResponseHelper = require('../../helper/ResponseHelper')
const absenService = require('../../services/absenService');

module.exports = async (req, res, next) => {

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