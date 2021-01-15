const steam = require('../../helper/steamAuthService');

steamController = {};

steamController.redirect = async(req, res, next) => {

    try {

        const redirectUrl = await steam.getRedirectUrl();
        console.log(redirectUrl);
        return res.redirect(redirectUrl);

    } catch(e){
        console.log(e);
        next(e);
    }

}

steamController.authenticate = async(req, res, next) => {

    try {

        const user = await steam.authenticate(req);
        console.log(user);

    } catch(e){
        console.log(e);
        next(e);
    }

}

module.exports = steamController;