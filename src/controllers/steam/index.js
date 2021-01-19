const steam = require('../../helper/steamAuthService');

steamController = {};

steamController.redirect = async(req, res, next) => {

    try {

        const redirectUrl = await steam.getRedirectUrl();
        return res.redirect(redirectUrl);

    } catch(e){
        next(e);
    }

}

steamController.authenticate = async(req, res, next) => {

    try {

        const user = await steam.authenticate(req);

    } catch(e){
        next(e);
    }

}

module.exports = steamController;