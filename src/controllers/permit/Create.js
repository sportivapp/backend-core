const permitService = require('../../services/permitService')
const ResponseHelper = require('../../helper/ResponseHelper')

module.exports = async (req, res, next) => {

    const permitRequest = req.body

    const user = req.user

    const permitDTO = {
        euseruserid: permitRequest.userId,
        epermitdescription: permitRequest.description,
        epermitstartdate: permitRequest.startDate,
        epermitenddate: permitRequest.endDate,
        epermitcreateby: req.user.sub
    }

    try {
        const result = await permitService.createPermit(permitDTO, user)
        console.log("aaaaaaa")
        if (!result)
            return res.status(400).json(ResponseHelper.toErrorResponse(400))
        return res.status(200).json(ResponseHelper.toBaseResponse(result))
    } catch (e) {
        console.log("aaaaaaa")
        next(e)
        // return res.status(500).json(ResponseHelper.toErrorResponse(500, "INTERNAL_SERVER_ERROR"))
    }

}