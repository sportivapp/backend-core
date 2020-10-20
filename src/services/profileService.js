const userService = require('./userService')
const companyService = require('./companyService')
const settingService = require('./settingService')
const gradeService = require('./gradeService')
const bcrypt = require('../helper/bcrypt')
const { NotFoundError, UnsupportedOperationError } = require('../models/errors')

const profileService = {}

const ErrorEnum = {
    PASSWORD_INVALID: 'PASSWORD_INVALID',
    USER_NOT_FOUND: 'USER_NOT_FOUND'
}

profileService.updateProfile = async (userDTO, user) => {

    return userService.updateUserById(user.sub, userDTO, user)
}

profileService.getProfile = async (user) => {

    return userService.getSingleUserById(user.sub);

}

profileService.getUserCurrentCompany = async (user) => {

    const company = await companyService.getCompanyById(user.companyId)
    return company
        .$query()
        .modify('idAndName')
        .withGraphFetched('older(idAndName) as parent .older(idAndName) as parent')
        .then(company => {
            if (!company) throw new NotFoundError()
            return company
        })

}

profileService.changeUserCompany = async (companyId, user) => {

    const isUserExistInCompany = await companyService.isUserExistInCompany(companyId, user.sub)

    if (!isUserExistInCompany) throw new UnsupportedOperationError('USER_NOT_IN_COMPANY')

    const loggedInUser = await userService.getUserById(user.sub, user)

    return userService.generateJWTToken(loggedInUser, companyId);
}

profileService.getFunctions = async (user) => {

    const gradeIds = await gradeService.getAllGradesByUserIdAndCompanyId(user.companyId, user.sub)
        .then(grades => grades.map(grade => grade.egradeid))

    const codes = await settingService.getAllFunctionCodesByGradeIds(gradeIds)

    const masterCodes = await settingService.getAllFunctions()
        .then(funcList => funcList.map(func => func.efunctioncode))

    let functions = {}

    masterCodes.forEach(masterCode => {
        functions[masterCode] = codes.indexOf(masterCode) !== -1
    })

    return functions

}

profileService.getFunctionCodes = async (user) => {

    const gradeIds = await gradeService.getAllGradesByUserIdAndCompanyId(user.companyId, user.sub)
        .then(grades => grades.map(grade => grade.egradeid))

    return settingService.getAllFunctionCodesByGradeIds(gradeIds)

}

profileService.changeUserPassword = async (user, oldPassword, newPassword) => {

    const userFromDB = await userService.getUserById(user.sub, user);

    if (!userFromDB) throw new UnsupportedOperationError(ErrorEnum.USER_NOT_FOUND)

    const samePassword = await bcrypt.compare(oldPassword, userFromDB.euserpassword);

    if (!samePassword)
        throw new UnsupportedOperationError(ErrorEnum.PASSWORD_INVALID);

    const encryptedPassword = await bcrypt.hash(newPassword);

    return userService.updateUserById(user.sub, { euserpassword: encryptedPassword }, user);

}

profileService.getModules = async (user) => {

    const gradeIds = await gradeService.getAllGradesByUserIdAndCompanyId(user.companyId, user.sub)
        .then(grades => grades.map(grade => grade.egradeid))

    const modules = await settingService.getModulesByGradeIds(user.companyId, gradeIds)

    if (modules.length === 0) {
        const module = await settingService.getDefaultModuleByCompanyId(user.companyId)
        return [module]
    }

    return modules

}

module.exports = profileService