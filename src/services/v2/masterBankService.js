const MasterBank = require('../../models/v2/MasterBank');

const masterBankService = {};

masterBankService.getAllBanks = async () => {

    return MasterBank.query()
        .modify('baseAttributes')

}

module.exports = masterBankService;