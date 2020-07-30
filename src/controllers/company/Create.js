const companyService = require('../../services/companyService');

module.exports = async (req, res, next) => {

    try {

        const { nik, name, password, mobileNumber, companyName, companyEmail, street, postalCode } = req.body;
        const userDTO = { 
            eusernik: nik, 
            eusername: name,
            euseremail: companyEmail, 
            euserpassword: password, 
            eusermobilenumber: mobileNumber
        }
        const companyDTO = { 
            ecompanyname: companyName,
            ecompanyemailaddress: companyEmail
        }
        const addressDTO = {
            eaddressstreet: street,
            eaddresspostalcode: postalCode
        }

        const data = await companyService.createCompany(userDTO, companyDTO, addressDTO);

        return res.status(200).json({
            data: data
        });

    } catch(e) {
        next(e);
    }

}