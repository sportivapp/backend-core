const permitService = require('../../services/permitService')
const ResponseHelper = require('../../helper/ResponseHelper')

module.exports = async (req, res, next) => {

    const permitRequest = req.body

    const user = req.user

    const permitDTO = {
        eusereuserid: permitRequest.userId,
        epermitdescription: permitRequest.description,
        epermitstartdate: permitRequest.startDate,
        epermitenddate: permitRequest.endDate,
        epermitcreateby: req.user.sub
    }

    try {
        const result = await permitService.createPermit(permitDTO, user)
        if (!result)
            return res.status(400).json(ResponseHelper.toErrorResponse(400))
        return res.status(200).json(ResponseHelper.toBaseResponse(result))
    } catch (e) {
        next(e)
    }

}