const ClassUserMapping = require('../models/ClassUserMapping')
const Class = require('../models/Class')
const mobileClassService = require('./mobileClassService')
const CompanyUserMapping = require('../models/CompanyUserMapping')
const ClassTypeEnum = require('../models/enum/ClassTypeEnum')
const ClassUserStatusEnum = require('../models/enum/ClassUserStatusEnum')
const ServiceHelper = require('../helper/ServiceHelper')
const { UnsupportedOperationError } = require('../models/errors')

const mobileClassUserService = {}

mobileClassUserService.registerByClassId = async (classId, user) => {

    if (!classId) throw new UnsupportedOperationError('CLASS_ID_REQUIRED')

    const foundClass = await Class.query().findById(classId)
    if (!foundClass) throw new UnsupportedOperationError('CLASS_NOT_FOUND')

    if (foundClass.eclasstype === ClassTypeEnum.PRIVATE) {

        const isUserInOrganization = await CompanyUserMapping.query()
            .where('ecompanyecompanyid', foundClass.ecompanyecompanyid)
            .andWhere('eusereuserid', user.sub)
            .then(list => list.length > 0)

        if (!isUserInOrganization) throw new UnsupportedOperationError('USER_NOT_IN_ORGANIZATION')
    }

    const classUserMapping = await ClassUserMapping.query()
        .where('eclasseclassid', classId)
        .where('eusereuserid', user.sub)
        .whereNot('eclassusermappingstatus', ClassUserStatusEnum.REJECTED)
        .andWhereNot('eclassusermappingstatus', ClassUserStatusEnum.CANCELED)
        .orderBy('eclassusermappingcreatetime', 'DESC')
        .first()
    
    if (!classUserMapping)

        return ClassUserMapping.query()
            .insertToTable({
                eclasseclassid: classId,
                eusereuserid: user.sub
            }, user.sub)
            .then(mapping => mobileClassService.getClassById(mapping.eclasseclassid, user))

    else return mobileClassService.getClassById(classUserMapping.eclasseclassid, user)
}

mobileClassUserService.cancelRegistrationByClassUserId = async (classUserId, user) => {

    const classUser = await ClassUserMapping.query().findById(classUserId)

    if (classUser.eclassusermappingstatus === 'APPROVED') return false

    return classUser.$query()
        .updateByUserId({ eclassusermappingstatus: ClassUserStatusEnum.CANCELED }, user.sub)
        .then(rowsAffected => rowsAffected === 1)
}

mobileClassUserService.processRegistration = async (classUserId, status, user) => {

    if (ClassUserStatusEnum.APPROVED !== status.toUpperCase() && ClassUserStatusEnum.REJECTED !== status.toUpperCase())
        throw new UnsupportedOperationError('STATUS_INVALID')

    const classUser = await ClassUserMapping.query()
        .where('eclasseclassid', classId)
        .where('eusereuserid', user.sub)
        .orderBy('eclassusermappingcreatetime', 'DESC')
        .withGraphFetched('class')
        .first()

    if (!classUser) throw new UnsupportedOperationError('NOT_FOUND')

    if (!classUser.class) throw new UnsupportedOperationError('CLASS_NOT_FOUND')

    const loggedInUserCompanies = await CompanyUserMapping.query()
        .where('eusereuserid', user.sub)
        .then(list => list.map(company => company.ecompanyid))

    if (loggedInUserCompanies.indexOf(classUser.class.ecompanyecompanyid) === -1)
        throw new UnsupportedOperationError('USER_NOT_IN_ORGANIZATION')

    if (classUser.eclassusermappingstatus === ClassUserStatusEnum.PENDING)

        return classUser.$query()
            .updateByUserId({ eclassusermappingstatus: status }, user.sub)
            .returning('*')
            .withGraphFetched('class')

    else return classUser
}

mobileClassUserService.getMyClasses = async (companyId, page, size, user) => {

    const query = ClassUserMapping.query()
        .select('class.*', 'class:company.ecompanyname', 'class:industry.eindustryname',
            'eclassusermapping.eclassusermappingstatus', 'eclassusermapping.eclassusermappingid')
        .joinRelated('class.[company(baseAttributes), industry(baseAttributes)]')
        .where('eclassusermapping.eusereuserid', user.sub)

    if (companyId && companyId !== '')

        return query
            .andWhere('class.ecompanyecompanyid', companyId)
            .page(page, size)
            .then(pageObj => ServiceHelper.toPageObj(page, size, pageObj))

    else

        return query
            .page(page, size)
            .then(pageObj => ServiceHelper.toPageObj(page, size, pageObj))
}

module.exports = mobileClassUserService