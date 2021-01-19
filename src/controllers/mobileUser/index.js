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
        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

controller.getOtherUserById = async (req, res, next) => {

    const { userId } = req.body;
    const { type } = req.query;

    try {
        
        const result = await mobileUserService.getOtherUserById(userId, type.toUpperCase());
        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

controller.getSelf = async (req, res, next) => {

    try {
        const result = await mobileUserService.getUserById(req.user.sub);
        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    } 

}

controller.updateUser = async (req, res, next) => {

    const { name, mobileNumber, identityNumber, dob, gender, hobby, countryId, fileId, address, industryIds, 
        facebook, instagram, linkedin, cityId } = req.body;

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
        ecityecityid: cityId,
    }

    try {

        const result = await mobileUserService.updateUser(userDTO, industryIds, req.user);
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
        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

controller.removeCoach = async (req, res, next) => {

    try {

        const result = await mobileUserService.removeCoach(req.user);
        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

controller.changePassword = async (req, res, next) => {

    const { oldPassword, newPassword } = req.body;

    try {

        const result = await mobileUserService.changePassword(oldPassword, newPassword, req.user);
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

controller.getListPendingByUserId = async (req, res, next) => {

    const {page = '0', size = '10', type = 'INVITE', sortType = 'DESC'} = req.query

    try {

        const pageObj = await mobileUserService.getListPendingByUserId(parseInt(page), parseInt(size), req.user.sub, type.toUpperCase(), sortType.toUpperCase());

        return res.status(200).json(ResponseHelper.toPageResponse(pageObj.data, pageObj.paging));

    } catch(e) {
        next(e);
    }

}


module.exports = controller;