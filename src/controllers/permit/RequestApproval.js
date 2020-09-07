const permitService = require('../../services/permitService')
const ResponseHelper = require('../../helper/ResponseHelper')

module.exports = async (req, res, next) => {

    const { permitId } = req.params

    const user = req.user

    try {
        const result = await permitService.requestApproval(parseInt(permitId), user)
        if (!result)
            return res.status(404).json(ResponseHelper.toErrorResponse(404))
        return res.status(200).json(ResponseHelper.toBaseResponse(result))
    } catch (e) {
        next(e)
    }
}