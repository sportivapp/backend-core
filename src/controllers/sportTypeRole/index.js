const sportTypeRoleService = require('../../services/sportTypeRoleService')
const ResponseHelper = require('../../helper/ResponseHelper')

const controller = {}

controller.getSportTypeRoleListByIndustryId = async (req, res, next) => {

    const { page = '0', size = '10' } = req.query
    const { industryId } = req.params

    try {

        const pageObj = await sportTypeRoleService.getSportTypeRoleListByIndustryId(parseInt(page), parseInt(size), parseInt(industryId))
        
        return res.status(200).json(ResponseHelper.toPageResponse(pageObj.data, pageObj.paging))

    } catch (e) {
        next(e)
    }
}


module.exports = controller