const State = require('../models/State')
const ServiceHelper = require('../helper/ServiceHelper')

const stateService = {};

stateService.getAllStates = async ( page, size ) => {
    
    const statePage = await State.query().select().page(page, size)

    return ServiceHelper.toPageObj(page, size, statePage)
}

module.exports = stateService
