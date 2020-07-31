const permitService = require('../../services/permitService')
const ResponseHelper = require('../../helper/ResponseHelper')

module.exports = async (req, res, next) => {

    const { page, size } = req.query
    console.log(page)

    const user = { ...req.user }

    try {
        const pageObj = await permitService.getPermitList(parseInt(page), parseInt(size), user)
        return res.status(200).json(ResponseHelper.toPageResponse(pageObj.data, pageObj.paging))
    }catch (e) {
        return res.status(500).json(ResponseHelper.toErrorResponse(500))
    }
}