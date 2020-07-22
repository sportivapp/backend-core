const Company = require('../models/Company');
const Address = require('../models/Address');
const User = require('../models/User');

const CompanyService = {};

CompanyService.createCompany = async(userDTO, companyDTO, addressDTO) => {

    const address = await Address.query().insert(addressDTO);

    companyDTO.eaddresseaddressid = address.eaddressid;
    const company = await Company.query().insert(companyDTO);

    // super user of the company
    userDTO.euserpermission = 10;
    const user = await User.query().insert(userDTO);

    return {
        user: user,
        company: company,
        address: address
    }

}

module.exports = CompanyService;