const City = require('../models/City')
const ServiceHelper = require('../helper/ServiceHelper');
const UnsupportedOperationError = require('../models/errors/UnsupportedOperationError');

const ErrorEnum = {
    INVALID_CITY_ID: 'INVALID_CITY_ID',
}

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

cityService.getTimezoneFromCityId = async (cityId) => {

    return City.query()
        .findById(cityId)
        .modify('timezone')
        .then(city => {
            if (!city)
                throw new UnsupportedOperationError(ErrorEnum.INVALID_CITY_ID);
            return city.state.estatetimezone;
        })

}

module.exports = cityService