const ClassUserMapping = require('../models/ClassUserMapping')
const Class = require('../models/Class')
const CompanyUserMapping = require('../models/CompanyUserMapping')
const ClassUserStatusEnum = require('../models/enum/ClassUserStatusEnum')
const ServiceHelper = require('../helper/ServiceHelper')
const { UnsupportedOperationError, NotFoundError } = require('../models/errors')

const classUserController = {}

const ErrorEnum = {
    CLASS_ID_REQUIRED: 'CLASS_ID_REQUIRED',
    CLASS_NOT_FOUND: 'CLASS_NOT_FOUND',
    USER_NOT_IN_ORGANIZATION: 'USER_NOT_IN_ORGANIZATION',
    STATUS_INVALID: 'STATUS_INVALID',

}

classUserController.getRegisteredUsersByClassId = async (page, size, classId, user) => {

    return ClassUserMapping.query()
    .where('eclasseclassid', classId)
    .where('eclassusermappingstatus', ClassUserStatusEnum.APPROVED)
    .withGraphFetched('user(baseAttributes)')
    .page(page, size)
    .then(pageObj => ServiceHelper.toPageObj(page, size, pageObj))

}

classUserController.getUsersPendingListByClassId = async (page, size, classId, user) => {

    const classInCompany = await Class.query()
    .findById(classId)
    .where('ecompanyecompanyid', user.companyId)

    if(!classInCompany) throw new UnsupportedOperationError(ErrorEnum.USER_NOT_IN_ORGANIZATION)

    return ClassUserMapping.query()
    .where('eclasseclassid', classId)
    .where('eclassusermappingstatus', ClassUserStatusEnum.PENDING)
    .orderBy('eclassusermappingcreatetime', 'DESC')
    .withGraphFetched('user(baseAttributes)')
    .page(page, size)
    .then(pageObj => ServiceHelper.toPageObj(page, size, pageObj))

}

classUserController.processRegistration = async (classId, status, userId, user) => {

    const classInCompany = await Class.query()
    .findById(classId)
    .where('ecompanyecompanyid', user.companyId)

    if(!classInCompany) throw new UnsupportedOperationError(ErrorEnum.USER_NOT_IN_ORGANIZATION)

    if (ClassUserStatusEnum.APPROVED !== status && ClassUserStatusEnum.REJECTED !== status)
        throw new UnsupportedOperationError(ErrorEnum.STATUS_INVALID)

    const classUser = await ClassUserMapping.query()
        .where('eclasseclassid', classId)
        .where('eusereuserid', userId)
        .where('eclassusermappingstatus', ClassUserStatusEnum.PENDING)
        .orderBy('eclassusermappingcreatetime', 'DESC')
        .withGraphFetched('class(baseAttributes)')
        .first()

    if (!classUser || !classUser.class) throw new UnsupportedOperationError(ErrorEnum.CLASS_NOT_FOUND)

    const loggedInUserCompanies = await CompanyUserMapping.query()
        .where('eusereuserid', userId)
        .then(list => list.map(company => company.ecompanyecompanyid))

    if (loggedInUserCompanies.indexOf(classUser.class.ecompanyecompanyid) === -1)
        throw new UnsupportedOperationError(ErrorEnum.USER_NOT_IN_ORGANIZATION)

    return classUser.$query()
        .updateByUserId({ eclassusermappingstatus: status }, user.sub)
        .returning('*')
        .withGraphFetched('class(baseAttributes)')
}


module.exports = classUserController