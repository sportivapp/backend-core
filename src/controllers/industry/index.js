const industryService = require('../../services/industryService')
const ResponseHelper = require('../../helper/ResponseHelper')

const controller = {}

controller.getIndustryList = async (req, res, next) => {

    const { keyword } = req.query

    try {
        const result = await industryService.getIndustryList(keyword)
        return res.status(200).json(ResponseHelper.toBaseResponse(result))
    } catch (e) {
        console.log(e)
        next(e)
    }

}

module.exports = controller