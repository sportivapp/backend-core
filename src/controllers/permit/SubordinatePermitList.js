const permitService = require('../../services/permitService')
const ResponseHelper = require('../../helper/ResponseHelper')

module.exports = async (req, res, next) => {

    const { page, size } = req.query

    const user = { ...req.user }

    try {
        const pageObj = await permitService.getSubordinatePermitList(parseInt(page), parseInt(size), user)
        return res.status(200).json(ResponseHelper.toPageResponse(pageObj.data, pageObj.paging))
    } catch (e) {
        next(e)
        return res.status(500).json(ResponseHelper.toErrorResponse(500))
    }
}