const Users = require('../../models/Users');



module.exports = async (req, res, next) => {

    try {

        const { nik, name, email, password, mobileNumber } = req.body;

        const user = await Users.query().insert({ eusernik: nik, eusername: name, euseremail: email, euserpassword: password, eusermobilenumber: mobileNumber });

        return res.status(200).json({
            data: user
        });

    } catch(e) {
        return res.status(500).send(e.stack);
    }

}