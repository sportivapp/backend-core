const stateService = require('../../services/stateService')
const ResponseHelper = require('../../helper/ResponseHelper')

const stateController = {}

stateController.getAllStates = async (req, res, next) => {

    const { page, size } = req.query

    try {
        const pageObj = await stateService.getAllStates(parseInt(page), parseInt(size))
        return res.status(200).json(ResponseHelper.toPageResponse(pageObj.data, pageObj.paging))
    } catch (e) {
        next(e)
    }
}

module.exports = stateController