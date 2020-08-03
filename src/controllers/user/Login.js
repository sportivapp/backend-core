const userService = require('../../services/userService');

module.exports = async (req, res, next) => {

    const { email, password } = req.body;
    const loginDTO = { 
        euseremail: email, 
        euserpassword: password
    }

    try {

        const token = await userService.login(loginDTO);

        if (token === null) {
            return res.status(400).json('Wrong email or password')
        }

        const data = {
            token: token
        }

        return res.status(200).json({
            data: data
        });

    } catch(e) {
        next(e);
    }

}