const mobileCompanyLogService = require('../../services/mobileCompanyLogService')
const ResponseHelper = require('../../helper/ResponseHelper')

const mobileCompanyLogController = {}

mobileCompanyLogController.getUserCompanyPendingListByLogType = async (req, res, next) => {

    const { page = '0', size = '10', type = 'APPLY' } = req.query

    try {

        const pageObj = await mobileCompanyLogService.getUserCompanyPendingListByLogType(parseInt(page), parseInt(size), type.toUpperCase(), req.user)

        return res.status(200).json(ResponseHelper.toPageResponse(pageObj.data, pageObj.paging))
        
    } catch (e) {
        next(e)
    }

}

module.exports = mobileCompanyLogController