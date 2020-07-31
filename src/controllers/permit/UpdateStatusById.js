const permitService = require('../../services/permitService')
const ResponseHelper = require('../../helper/ResponseHelper')

module.exports = async (req, res, next) => {

    const { permitId, status } = req.body

    const user = req.user

    try {
        const result = await permitService.updatePermitStatusById(permitId, status, user)
        return res.status(200).json(ResponseHelper.toBaseResponse(result))
    } catch (e) {
        return res.status(500).json(ResponseHelper.toErrorResponse(500))
    }
}