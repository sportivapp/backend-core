const usersService = require('../../services/usersService');

module.exports = async (req, res, next) => {

    try {

        const { nik, name, email, password, mobileNumber } = req.body;
        const userDTO = { 
            eusernik: nik, 
            eusername: name, 
            euseremail: email, 
            euserpassword: password, 
            eusermobilenumber: mobileNumber
        }

        const user = await usersService.createUser( userDTO );

        return res.status(200).json({
            data: user
        });

    } catch(e) {
        next(e);
    }

}