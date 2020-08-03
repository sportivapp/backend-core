const ResponseHelper = require('../../helper/ResponseHelper')
const userService = require('../../services/userService');

module.exports = async (req, res, next) => {

    const { page, size } = req.query
    const user = req.user
    const { companyId } = req.params

    try {

        const pageObj = await userService.getAllUserByCompanyId(parseInt(page), parseInt(size), companyId, user)

        if(!pageObj)
            return res.status(400).json(ResponseHelper.toErrorResponse(400))

        return res.status(200).json(ResponseHelper.toBaseResponse(pageObj.data, pageObj.paging))
 
    } catch(e) {
        next(e);
    }

}