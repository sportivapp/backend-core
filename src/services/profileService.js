const userService = require('./userService')
const companyService = require('./companyService')
const settingService = require('./settingService')
const gradeService = require('./gradeService')
const { NotFoundError, UnsupportedOperationError } = require('../models/errors')

const profileService = {}

profileService.updateProfile = async (userDTO, user) => {

    return userService.updateUserById(user.sub, userDTO, user)
}

profileService.getProfile = async (user) => {

    return userService.getUserById(user.sub, user);

}

profileService.getUserCurrentCompany = async (user) => {

    return companyService.getCompanyById(user.companyId)
        .modify('idAndName')
        .withGraphFetched('older(idAndName).older(idAndName)')
        .then(company => {
            if (!company) throw new NotFoundError()
            return company
        })

}

profileService.changeUserCompany = async (companyId, user) => {

    const isUserExistInCompany = await companyService.isUserExistInCompany(companyId, user.sub)

    if (!isUserExistInCompany) throw new UnsupportedOperationError('USER_NOT_IN_COMPANY')

    const loggedInUser = await userService.getUserById(user.sub, user)

    const functions = await profileService.getFunctions(companyId, user)

    return userService.generateJWTToken(loggedInUser, companyId, functions);
}

profileService.getFunctions = async (user) => {

    const gradeIds = gradeService.getAllGradesByUserIdAndCompanyId(user.companyId, user.sub)
        .then(grades => grades.map(grade => grade.egradeid))

    return settingService.getAllFunctionByGradeIds(gradeIds)

}

profileService.changeUserPassword = async (user , newPassword) => {

    const encryptedPassword = await bcrypt.hash(newPassword);

    return userService.updateUserById(user.sub, { euserpassword: encryptedPassword }, user.sub)
}

profileService.getModules = async (user) => {

    const gradeIds = gradeService.getAllGradesByUserIdAndCompanyId(user.companyId, user.sub)
        .then(grades => grades.map(grade => grade.egradeid))

    return settingService.getModulesByGradeIds(gradeIds)

}

module.exports = profileService