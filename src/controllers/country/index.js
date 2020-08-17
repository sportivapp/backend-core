const countryService = require('../../services/countryService')
const ResponseHelper = require('../../helper/ResponseHelper')

const countryController = {}

countryController.getAllCountries = async (req, res, next) => {

    const { page, size } = req.query

    try {
        const pageObj = await countryService.getAllCountries(parseInt(page), parseInt(size))
        return res.status(200).json(ResponseHelper.toPageResponse(pageObj.data, pageObj.paging))
    } catch (e) {
        next(e)
    }
}

module.exports = countryController
