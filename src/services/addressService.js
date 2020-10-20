const Knex = require('knex');
const Address = require('../models/Address');

const AddressService = {};

AddressService.createAddress = async (addressDTO, user, db = Address.knex()) => {

    return Address.query(db)
        .modify('baseAttributes')
        .insertToTable(addressDTO, user.sub);

}

module.exports = AddressService;