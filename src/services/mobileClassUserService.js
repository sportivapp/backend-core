const ClassUserMapping = require('../models/ClassUserMapping')
const Class = require('../models/Class')
const mobileClassService = require('./mobileClassService')
const CompanyUserMapping = require('../models/CompanyUserMapping')
const ClassTypeEnum = require('../models/enum/ClassTypeEnum')
const ClassUserStatusEnum = require('../models/enum/ClassUserStatusEnum')
const ServiceHelper = require('../helper/ServiceHelper')
const { UnsupportedOperationError, NotFoundError } = require('../models/errors')
const NotificationEnum = require('../models/enum/NotificationEnum')
const notificationService = require('./notificationService')
const Grade = require('../models/Grades')


const mobileClassUserService = {}

const ErrorEnum = {
    CLASS_ID_REQUIRED: 'CLASS_ID_REQUIRED',
    CLASS_NOT_FOUND: 'CLASS_NOT_FOUND',
    USER_NOT_IN_ORGANIZATION: 'USER_NOT_IN_ORGANIZATION',
    STATUS_INVALID: 'STATUS_INVALID',

}

mobileClassUserService.getHighestPosition = async (classId) => {

    const foundCompany = await Class.query()
    .select('ecompanyecompanyid')
    .findById(classId)

    if(!foundCompany) throw new NotFoundError()    

    const users = await Grade.relatedQuery('users')
    .for(Grade.query()
    .where('ecompanyecompanyid',foundCompany.ecompanyecompanyid).andWhere('egradesuperiorid', null))
    .distinct('euserid')

    return users.map(user => user.euserid)

}

mobileClassUserService.registerByClassId = async (classId, user) => {

    const getHighestPosition = await mobileClassUserService.getHighestPosition(classId)

    if (!classId) throw new UnsupportedOperationError(ErrorEnum.CLASS_ID_REQUIRED)

    const foundClass = await Class.query().findById(classId)

    if (!foundClass) throw new UnsupportedOperationError(ErrorEnum.CLASS_NOT_FOUND)

    if (foundClass.eclasstype === ClassTypeEnum.PRIVATE) {

        const isUserInOrganization = await CompanyUserMapping.query()
            .where('ecompanyecompanyid', foundClass.ecompanyecompanyid)
            .andWhere('eusereuserid', user.sub)
            .then(list => list.length > 0)

        if (!isUserInOrganization) throw new UnsupportedOperationError(ErrorEnum.USER_NOT_IN_ORGANIZATION)
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
            .then(mapping => mobileClassService.getClassById(mapping.eclasseclassid, user)
            .then(classLog => {

            if(getHighestPosition.length > 0) {
                const notificationObj = {
                    enotificationbodyentityid: classId,
                    enotificationbodyentitytype: NotificationEnum.class.type,
                    enotificationbodyaction: NotificationEnum.class.actions.register.code,
                    enotificationbodytitle: NotificationEnum.class.actions.register.title,
                    enotificationbodymessage: NotificationEnum.class.actions.register.message
                }

                notificationService.saveNotification(
                    notificationObj,
                    user,
                    getHighestPosition
                )
            }
                return classLog
            }))

    else return mobileClassService.getClassById(classUserMapping.eclasseclassid, user)
}

mobileClassUserService.cancelRegistrationByClassUserId = async (classUserId, user) => {

    const getHighestPosition = await mobileClassUserService.getHighestPosition(classId)

    const classUser = await ClassUserMapping.query().findById(classUserId)

    if (classUser.eclassusermappingstatus === ClassUserStatusEnum.APPROVED) return false

    return classUser.$query()
        .updateByUserId({ eclassusermappingstatus: ClassUserStatusEnum.CANCELED }, user.sub)
        .then(rowsAffected => rowsAffected === 1)
        .then(classLog => { 

        if(getHighestPosition.length > 0) {
            const notificationObj = {
            enotificationbodyentityid: classId,
            enotificationbodyentitytype: NotificationEnum.class.type,
            enotificationbodyaction: NotificationEnum.class.actions.canceled.code,
            enotificationbodytitle: NotificationEnum.class.actions.canceled.title,
            enotificationbodymessage: NotificationEnum.class.actions.canceled.message
        }

        notificationService.saveNotification(
            notificationObj,
            user,
            getHighestPosition
        )
    }
        return classLog
    })
}

mobileClassUserService.processRegistration = async (classUserId, status, user) => {

    if (ClassUserStatusEnum.APPROVED !== status.toUpperCase() && ClassUserStatusEnum.REJECTED !== status.toUpperCase())
        throw new UnsupportedOperationError(ErrorEnum.STATUS_INVALID)

    const classUser = await ClassUserMapping.query()
        .where('eclasseclassid', classId)
        .where('eusereuserid', user.sub)
        .orderBy('eclassusermappingcreatetime', 'DESC')
        .withGraphFetched('class(baseAttributes)')
        .first()

    if (!classUser || !classUser.class) throw new UnsupportedOperationError(ErrorEnum.CLASS_NOT_FOUND)

    const loggedInUserCompanies = await CompanyUserMapping.query()
        .where('eusereuserid', user.sub)
        .then(list => list.map(company => company.ecompanyid))

    if (loggedInUserCompanies.indexOf(classUser.class.ecompanyecompanyid) === -1)
        throw new UnsupportedOperationError(ErrorEnum.USER_NOT_IN_ORGANIZATION)

    if (classUser.eclassusermappingstatus === ClassUserStatusEnum.PENDING)

        return classUser.$query()
            .updateByUserId({ eclassusermappingstatus: status }, user.sub)
            .returning('*')
            .withGraphFetched('class(baseAttributes)')

    else return classUser
}

mobileClassUserService.getMyClasses = async (companyId, page, size, user) => {

    const query = ClassUserMapping.query()
        .select('class.*')
        .select('eclassusermapping.eclassusermappingid', 'eclassusermapping.eclassusermappingstatus')
        .select('class:company.ecompanyid', 'class:company.ecompanyname')
        .select('class:industry.eindustryid', 'class:industry.eindustryname')
        .joinRelated('class(baseAttributes).[company(baseAttributes), industry(baseAttributes)]')
        .where('eclassusermapping.eusereuserid', user.sub)
        .andWhereNot('eclassusermappingstatus', ClassUserStatusEnum.CANCELED)
        .andWhereNot('eclassusermappingstatus', ClassUserStatusEnum.REJECTED)

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

mobileClassUserService.getHistoryClasses = async (companyId, page, size, user) => {

    const query = ClassUserMapping.query()
        .select('class.*')
        .select('eclassusermapping.eclassusermappingid', 'eclassusermapping.eclassusermappingstatus')
        .select('class:company.ecompanyid', 'class:company.ecompanyname')
        .select('class:industry.eindustryid', 'class:industry.eindustryname')
        .joinRelated('class(baseAttributes).[company(baseAttributes), industry(baseAttributes)]')
        .where('eclassusermapping.eusereuserid', user.sub)
        .andWhere('eclassusermappingstatus', ClassUserStatusEnum.REJECTED)

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

mobileClassUserService.getHistoryClassById = async (classUserId, user) => {

    const classUser = await ClassUserMapping.query()
        .select('eclassusermappingid', 'eclassusermappingstatus')
        .select('class.*')
        .select('class:company.ecompanyid','class:company.ecompanyname')
        .select('class:industry.eindustryid', 'class:industry.eindustryname')
        .joinRelated('class(baseAttributes).[company(baseAttributes), industry(baseAttributes)]')
        .where('eclassusermappingid', classUserId)
        .orderBy('eclassusermappingcreatetime', 'DESC')
        .first()

    if (!classUser) throw new NotFoundError()

    const requirements = await ClassRequirement.query()
        .where('eclasseclassid', classUser.eclassid)

    const mapping = await CompanyUserMapping.query()
        .where('ecompanyecompanyid', classUser.ecompanyid)
        .where('eusereuserid', user.sub)
        .first()

    return {
        ...classUser,
        isRegistered: true,
        isInCompany: !!mapping,
        requirements
    }
}

module.exports = mobileClassUserService