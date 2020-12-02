const City = require('../models/City')
const ServiceHelper = require('../helper/ServiceHelper')

const cityService = {};

cityService.getAllCitiesByCountryId = async ( countryId, page, size ) => {
    
    const cityPage = await City.query()
        .select()
        .modify('baseAttributes')
        .where('ecountryecountryid', countryId)
        .page(page, size)

    return ServiceHelper.toPageObj(page, size, cityPage)
}

module.exports = cityService