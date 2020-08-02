const ResponseHelper = require('../../helper/ResponseHelper')
const absenService = require('../../services/absenService');

module.exports = async (req, res, next) => {
    
    const { page, size } = req.query

    try {

        const pageObj = await absenService.listAbsen(parseInt(page), parseInt(size));

        return res.status(200).json(ResponseHelper.toBaseResponse(pageObj.data, pageObj.paging))
        
    } catch (e) {
        next(e);
    }
}