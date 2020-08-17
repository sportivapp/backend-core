const Country = require('../models/Country')
const ServiceHelper = require('../helper/ServiceHelper')

const countryService = {};

countryService.getAllCountries = async ( page, size ) => {
    
    const countryPage = await Country.query().select().page(page, size)

    return ServiceHelper.toPageObj(page, size, countryPage)
}

module.exports = countryService
