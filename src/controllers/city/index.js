const cityService = require('../../services/cityService')
const ResponseHelper = require('../../helper/ResponseHelper')

const cityController = {}

cityController.getAllCitiesByCountryId = async (req, res, next) => {

    const { countryId, stateId, page, size } = req.query

    try {
        const pageObj = await cityService.getAllCitiesByCountryId(parseInt(countryId), parseInt(stateId), parseInt(page), parseInt(size))
        return res.status(200).json(ResponseHelper.toPageResponse(pageObj.data, pageObj.paging))
    } catch (e) {
        next(e)
    }
}

module.exports = cityController;