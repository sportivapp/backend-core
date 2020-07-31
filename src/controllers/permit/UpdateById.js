const permitService = require('../../services/permitService')
const ResponseHelper = require('../../helper/ResponseHelper')

module.exports = async (req, res, next) => {

    const { permitId } = req.params

    const permitRequest = req.body

    const user = { ...req.user }

    const permitDTO = {
        epermitdescription: permitRequest.description,
        epermitStartDate: permitRequest.startDate,
        epermitEndDate: permitRequest.endDate
    }

    try {
        const result = await permitService.updatePermitById(permitId, permitDTO, user)
        return res.status(200).json(ResponseHelper.toBaseResponse(result))
    } catch (e) {
        return res.status(500).json(ResponseHelper.toErrorResponse(500))
    }
}