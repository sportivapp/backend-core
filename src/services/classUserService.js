const ClassUserMapping = require('../models/ClassUserMapping')
const Class = require('../models/Class')
const CompanyUserMapping = require('../models/CompanyUserMapping')
const ClassUserStatusEnum = require('../models/enum/ClassUserStatusEnum')
const ServiceHelper = require('../helper/ServiceHelper')
const { UnsupportedOperationError } = require('../models/errors')

const classUserService = {}

const ErrorEnum = {
    CLASS_ID_REQUIRED: 'CLASS_ID_REQUIRED',
    CLASS_USER_NOT_FOUND: 'CLASS_USER_NOT_FOUND',
    CLASS_NOT_IN_ORGANIZATION: 'CLASS_NOT_IN_ORGANIZATION',
    STATUS_INVALID: 'STATUS_INVALID',
    ONE_OR_MORE_CLASS_USER_NOT_FOUND: 'ONE_OR_MORE_CLASS_USER_NOT_FOUND',
}

classUserService.getRegisteredUsersByClassId = async (page, size, classId) => {

    return ClassUserMapping.query()
    .where('eclasseclassid', classId)
    .where('eclassusermappingstatus', ClassUserStatusEnum.APPROVED)
    .withGraphFetched('user(baseAttributes)')
    .page(page, size)
    .then(pageObj => ServiceHelper.toPageObj(page, size, pageObj))

}

classUserService.getUsersPendingListByClassId = async (page, size, classId, user) => {

    const classInCompany = await Class.query()
    .findById(classId)
    .where('ecompanyecompanyid', user.companyId)

    if(!classInCompany) throw new UnsupportedOperationError(ErrorEnum.CLASS_NOT_IN_ORGANIZATION)

    return ClassUserMapping.query()
    .where('eclasseclassid', classId)
    .where('eclassusermappingstatus', ClassUserStatusEnum.PENDING)
    .orderBy('eclassusermappingcreatetime', 'DESC')
    .withGraphFetched('user(baseAttributes)')
    .page(page, size)
    .then(pageObj => ServiceHelper.toPageObj(page, size, pageObj))

}

classUserService.processRegistration = async (classId, status, userClassIds, user) => {

    if (ClassUserStatusEnum.APPROVED !== status && ClassUserStatusEnum.REJECTED !== status)
        throw new UnsupportedOperationError(ErrorEnum.STATUS_INVALID);

    const classInCompany = await Class.query()
    .findById(classId)
    .where('ecompanyecompanyid', user.companyId);

    if(!classInCompany) throw new UnsupportedOperationError(ErrorEnum.CLASS_NOT_IN_ORGANIZATION);

    const classUser = await ClassUserMapping.query()
        .where('eclasseclassid', classId)
        .whereIn('eclassusermappingid', userClassIds)
        .where('eclassusermappingstatus', ClassUserStatusEnum.PENDING)
        .orderBy('eclassusermappingcreatetime', 'DESC');

    if (classUser.length === 0) throw new UnsupportedOperationError(ErrorEnum.CLASS_USER_NOT_FOUND);

    if (classUser.length !== userClassIds.length) 
        throw new UnsupportedOperationError(ErrorEnum.ONE_OR_MORE_CLASS_USER_NOT_FOUND);

    return classUser.$query()
        .updateByUserId({ eclassusermappingstatus: status }, user.sub)
        .returning('*')
        .withGraphFetched('class(baseAttributes)')
}


module.exports = classUserService