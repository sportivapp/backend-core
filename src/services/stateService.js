const State = require('../models/State')
const ServiceHelper = require('../helper/ServiceHelper')

const stateService = {};

stateService.getAllStates = async ( page, size, countryId ) => {
    
    if(!countryId)
        return ServiceHelper.toEmptyPage(page, size)
        
    const statePage = await State.query().select().where('ecountryecountryid', countryId ).page(page, size)

    return ServiceHelper.toPageObj(page, size, statePage)
}

module.exports = stateService
