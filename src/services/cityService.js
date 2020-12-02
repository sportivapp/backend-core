const City = require('../models/City')
const ServiceHelper = require('../helper/ServiceHelper')

const cityService = {};

cityService.getAllCitiesByCountryId = async ( countryId, stateId, page, size ) => {
    
    const cityPage = City.query()
        .select()
        .modify('baseAttributes')
        
    if (stateId)
        cityPage.where('estateestateid', stateId)

    if (countryId)
        cityPage.where('ecountryecountryid', countryId)

    return cityPage.page(page, size)
        .then(cityPage => ServiceHelper.toPageObj(page, size, cityPage));

}

module.exports = cityService