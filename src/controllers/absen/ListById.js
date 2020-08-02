const ResponseHelper = require('../../helper/ResponseHelper')
const absenService = require('../../services/absenService');

module.exports = async (req, res, next) => {

    const { page, size } = req.query
    const { userId } = req.params

    try {

        const pageObj = await absenService.listAbsenById(parseInt(page), parseInt(size), userId);

        return res.status(200).json(ResponseHelper.toBaseResponse(pageObj.data, pageObj.paging))
        
    } catch (e) {
        next(e);
    }
}