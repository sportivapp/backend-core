const mobileUserService = require('../../services/mobileUserService');
const ResponseHelper = require('../../helper/ResponseHelper');
// const axios = require('axios');

const controller = {};

controller.login = async (req, res, next) => {
    
    const { email, password } = req.body;

    const loginDTO = {
        euseremail: email.toLowerCase(),
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

    const { nik, name, email, mobileNumber, password, otpCode } = req.body;

    const userDTO = {
        eusernik: nik,
        eusername: name,
        euseremail: email.toLowerCase(),
        eusermobilenumber: mobileNumber,
        euserpassword: password
    }

    try {
        const result = await mobileUserService.createUser(userDTO, otpCode);

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
            return res.status(404).json(ResponseHelper.toErrorResponse(404));
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
            return res.status(404).json(ResponseHelper.toErrorResponse(404));
        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    } 

}

controller.updateUser = async (req, res, next) => {

    const { name, mobileNumber, identityNumber, dob, gender, hobby, countryId, fileId, address, industryIds, facebook, instagram, linkedin } = req.body;

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

        const result = await mobileUserService.updateUser(userDTO, industryIds, req.user);

        if (!result)
            return res.status(400).json(ResponseHelper.toErrorResponse(400));
        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

controller.updateUserCoachData = async (req, res, next) => {

    const { name, mobileNumber, dob, gender, hobby, countryId, fileId, address, facebook, instagram, linkedin, industryIds } = req.body;

    const userCoachDTO = {
        eusername: name,
        eusermobilenumber: mobileNumber,
        euserdob: dob,
        eusergender: gender,
        euserhobby: hobby,
        ecountryecountryid : countryId,
        efileefileid: fileId === 0 ? null : fileId,
        euseraddress: address,
        euserfacebook: facebook,
        euserinstagram: instagram,
        euserlinkedin: linkedin,
        euseriscoach: true
    }

    try {

        const result = await mobileUserService.updateUserCoachData(userCoachDTO, req.user, industryIds);

        if (!result)
            return res.status(400).json(ResponseHelper.toErrorResponse(400));
        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

controller.removeCoach = async (req, res, next) => {

    try {

        const result = await mobileUserService.removeCoach(req.user);

        if (!result)
            return res.status(400).json(ResponseHelper.toErrorResponse(400));
        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

controller.changePassword = async (req, res, next) => {

    const { oldPassword, newPassword } = req.body;

    try {

        const result = await mobileUserService.changePassword(oldPassword, newPassword, req.user);

        if (result === 'no user')
            return res.status(400).json(ResponseHelper.toErrorResponse(400));

        if (result === 'wrong password')
            return res.status(403).json(ResponseHelper.toErrorResponse(403));

        return res.status(200).json(ResponseHelper.toBaseResponse(result));
    } catch(e) {
        next(e);
    }

}

controller.getIndustryByUserId = async (req, res, next) => {

    const { type } = req.query

    try {
        const result = await mobileUserService.getIndustryByUserId(req.user, type.toUpperCase())
        return res.status(200).json(ResponseHelper.toBaseResponse(result))
    } catch (e) {
        next(e)
    }

}

controller.changeIndustryByUserId = async (req, res, next) => {

    const { type } = req.query

    try {
        const result = await mobileUserService.changeIndustryByUserId(req.user, type.toUpperCase(), req.body.industryIds)
        return res.status(200).json(ResponseHelper.toBaseResponse(result))
    } catch (e) {
        next(e)
    }

}

module.exports = controller;