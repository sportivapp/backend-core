const Company = require('../../models/Company');
const Address = require('../../models/Address');

module.exports = async (req, res, next) => {

    try {

        const { name, email, street, postalCode } = req.body;
        let companyDTO = { 
            ecompanyname: name,
            ecompanyemailaddress: email
        }
        const addressDTO = {
            eaddressstreet: street,
            eaddresspostalcode: postalCode
        }

        const address = await Address.query().insert(addressDTO);

        companyDTO.eaddresseaddressid = address.eaddressid;
        const company = await Company.query().insert(companyDTO);

        return res.status(200).json({
            data: company
        });

    } catch(e) {
        next(e);
    }

}