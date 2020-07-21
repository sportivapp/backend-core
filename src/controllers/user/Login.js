const userService = require('../../services/userService');

module.exports = async (req, res, next) => {

    try {

        const { email, password } = req.body;
        const loginDTO = { 
            euseremail: email, 
            euserpassword: password
        }

        const token = await userService.login(loginDTO);

        if (token === null) {
            return res.status(400).json('Wrong email or password')
        }

        return res.status(200).json({
            data: token
        });

    } catch(e) {
        next(e);
    }

}