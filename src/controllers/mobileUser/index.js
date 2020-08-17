const mobileUserService = require('../../services/mobileUserService');
const ResponseHelper = require('../../helper/ResponseHelper');
// const axios = require('axios');

const controller = {};

controller.login = async (req, res, next) => {

    console.log('yes')
    const { email, password } = req.body;

    const loginDTO = {
        euseremail: email,
        euserpassword: password
    }

    try {
        const result = await mobileUserService.login(loginDTO);

        if (!result)
            return res.status(400).json(ResponseHelper.toErrorResponse(400));
        return res.status(200).json(ResponseHelper.toBaseResponse(result));
    } catch(e) {
        next(e);    
    }

}

controller.createUser = async (req, res, next) => {

    const { nik, name, email, mobileNumber, password } = req.body;

    const userDTO = {
        eusernik: nik,
        eusername: name,
        euseremail: email,
        eusermobilenumber: mobileNumber,
        euserpassword: password
    }

    try {
        const result = await mobileUserService.createUser(userDTO);

        if (!result)
            return res.status(400).json(ResponseHelper.toErrorResponse(400));
        return res.status(200).json(ResponseHelper.toBaseResponse(result));
    } catch(e) {
        next(e);
    }

}

controller.getUserById = async (req, res, next) => {

    const { userId } = req.body;

    try {
        const result = await mobileUserService.getUserById(userId);

        if (!result)
            return res.status(400).json(ResponseHelper.toErrorResponse(400));
        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

controller.getSelf = async (req, res, next) => {
    
    // const login = await axios.post('http://103.253.113.217:7000/api/v1/user-login', { 
    //     "email": "nawakarapm@nawakara.com",
    //     "password": "emtivnawakarapm"
    // });
    // console.log(login.data);
    // console.log(login.status);

    try {
        const result = await mobileUserService.getUserById(req.user.sub);

        if (!result)
            return res.status(400).json(ResponseHelper.toErrorResponse(400));
        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    } 

}

controller.updateUser = async (req, res, next) => {

    const { name, mobileNumber, identityNumber, dob, gender, hobby, countryId, fileId, address, facebook, instagram, linkedin } = req.body;

    const userDTO = {
        eusername: name,
        eusermobilenumber: mobileNumber,
        euseridentitynumber: identityNumber,
        euserdob: dob,
        eusergender: gender,
        euserhobby: hobby,
        ecountryecountryid : countryId,
        efileefileid: fileId,
        euseraddress: address,
        euserfacebook: facebook,
        euserinstagram: instagram,
        euserlinkedin: linkedin,
    }

    try {

        const result = await mobileUserService.updateUser(userDTO, req.user);

        if (!result)
            return res.status(400).json(ResponseHelper.toErrorResponse(400));
        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

controller.changePassword = async (req, res, next) => {

    const { newPassword } = req.body;

    try {

        const result = await mobileUserService.changePassword(newPassword, req.user);

        if (!result)
            return res.status(400).json(ResponseHelper.toErrorResponse(400));
        return res.status(200).json(ResponseHelper.toBaseResponse(result));
    } catch(e) {
        next(e);
    }

}

module.exports = controller;