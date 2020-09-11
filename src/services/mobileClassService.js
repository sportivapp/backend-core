const Class = require('../models/Class')
const ClassUserMapping = require('../models/ClassUserMapping')
const Industry = require('../models/Industry')
const Company = require('../models/Company')
const ClassRequirement = require('../models/ClassRequirement')
const fileService = require('./fileService')
const ServiceHelper = require('../helper/ServiceHelper')
const CompanyUserMapping = require('../models/CompanyUserMapping')
const { NotFoundError, UnsupportedOperationError } = require('../models/errors')
const ClassTypeEnum = require('../models/enum/ClassTypeEnum')
const ClassUserStatusEnum = require('../models/enum/ClassUserStatusEnum')
const { raw } = require('objection')

const mobileClassService = {}

const ErrorEnum = {
    COMPANY_NOT_FOUND: 'COMPANY_NOT_FOUND',
    INDUSTRY_NOT_FOUND: 'INDUSTRY_NOT_FOUND',
    TYPE_INVALID: 'TYPE_INVALID',
    FILE_REQUIRED: 'FILE_REQUIRED',
    FILE_NOT_FOUND: 'FILE_NOT_FOUND'
}

mobileClassService.createClass = async (classDTO, requirements, user) => {

    const industry = await Industry.query().findById(classDTO.eindustryeindustryid)

    const company = await Company.query().findById(classDTO.ecompanyecompanyid)

    if (!company) throw new UnsupportedOperationError(ErrorEnum.COMPANY_NOT_FOUND)

    if (!industry) throw new UnsupportedOperationError(ErrorEnum.INDUSTRY_NOT_FOUND)

    if (!ClassTypeEnum.hasOwnProperty(classDTO.eclasstype)) throw new UnsupportedOperationError(ErrorEnum.TYPE_INVALID)

    if (ClassTypeEnum.PRIVATE === classDTO.eclasstype && !classDTO.ecompanyecompanyid)
        throw new UnsupportedOperationError(ErrorEnum.TYPE_INVALID)

    if (!classDTO.efileefileid) throw new UnsupportedOperationError(ErrorEnum.FILE_REQUIRED)

    const file = await fileService.getFileById(classDTO.efileefileid)

    if (!file) throw new UnsupportedOperationError(ErrorEnum.FILE_NOT_FOUND)

    return Class.transaction(async trx => {

        const cls = await Class.query(trx)
            .insertToTable(classDTO, user.sub)
            .modify('baseAttributes');

        if (requirements && requirements.length > 0) {

            const classRequirements = requirements.map(requirement => {
                return {
                    eclasseclassid: cls.eclassid,
                    eclassrequirementname: requirement
                }
            });

            await cls.$relatedQuery('requirements', trx)
                .insertToTable(classRequirements, user.sub);

        }

        return cls;

    });

}

mobileClassService.getAllClassByCompanyId = async (companyId, page, size, keyword) => {

    if (companyId < 1) companyId = null

    let pageQuery = Class.query()
        .modify('baseAttributes')
        .select('eclass.*')
        .select('company.ecompanyname')
        .select('industry.eindustryname')
        .joinRelated('company(baseAttributes)')
        .joinRelated('industry(baseAttributes)')

    if (companyId && companyId !== '') pageQuery = pageQuery.where('ecompanyecompanyid', companyId)

    return pageQuery
        .where(raw('lower("eclassname")'), 'like', `%${keyword.toLowerCase()}%`)
        .modify('baseAttributes')
        .page(page, size)
        .then(pageObj => ServiceHelper.toPageObj(page, size, pageObj))
}

mobileClassService.getClassById = async (classId, user) => {

    const classUser = await ClassUserMapping.query()
        .select('eclassusermappingid', 'eclassusermappingstatus')
        .select('class.*')
        .select('class:company.ecompanyid','class:company.ecompanyname')
        .select('class:industry.eindustryid', 'class:industry.eindustryname')
        .joinRelated('class(baseAttributes).[company(baseAttributes), industry(baseAttributes)]')
        .where('eclasseclassid', classId)
        .andWhere('eusereuserid', user.sub)
        .orderBy('eclassusermappingcreatetime', 'DESC')
        .first()


    if (classUser && classUser.eclassusermappingstatus !== ClassUserStatusEnum.CANCELED
        && classUser.eclassusermappingstatus !== ClassUserStatusEnum.REJECTED) {

        const mapping = await CompanyUserMapping.query()
            .where('ecompanyecompanyid', classUser.ecompanyid)
            .where('eusereuserid', user.sub)
            .first()

        return {
            ...classUser,
            isRegistered: true,
            isInCompany: !!mapping
        }

    }

    else {

        const foundClass = await Class.query()
            .findById(classId)
            .select('company.ecompanyid','company.ecompanyname')
            .select('industry.eindustryid', 'industry.eindustryname')
            .joinRelated('company(baseAttributes)')
            .joinRelated('industry(baseAttributes)')
            .modify('baseAttributes')
            .then(foundClass => {
                if (!foundClass) throw new NotFoundError()
                return foundClass
            })

        const mapping = await CompanyUserMapping.query()
            .where('ecompanyecompanyid', foundClass.ecompanyecompanyid)
            .where('eusereuserid', user.sub)
            .first()

        return {
            ...foundClass,
            isRegistered: false,
            isInCompany: !!mapping
        }

    }
}

mobileClassService.getOnlyClassById = async (classId) => {

    return Class.query()
            .findById(classId)
            .modify('baseAttributes')
            .joinRelated('[company(baseAttributes), industry(baseAttributes)]')
            .then(foundClass => {
                if (!foundClass) throw new NotFoundError()
                return foundClass
            })

}

mobileClassService.updateClassById = async (classId, classDTO, requirements, user) => {

    const industry = await Industry.query().findById(classDTO.eindustryeindustryid)

    if (!industry) throw new UnsupportedOperationError(ErrorEnum.INDUSTRY_NOT_FOUND)

    if (!ClassTypeEnum.hasOwnProperty(classDTO.eclasstype)) throw new UnsupportedOperationError(ErrorEnum.TYPE_INVALID)

    if (!classDTO.efileefileid) throw new UnsupportedOperationError(ErrorEnum.FILE_REQUIRED)

    const cls = await mobileClassService.getOnlyClassById(classId);
    
    if (cls.efileefileid !== classDTO.efileefileid) {

        const file = await fileService.getFileById(classDTO.efileefileid)

        if (!file) throw new UnsupportedOperationError(ErrorEnum.FILE_NOT_FOUND)

    }

    return Class.transaction(async trx => {

        const classRequirements = requirements.map(requirement => {
            return {
                eclasseclassid: cls.eclassid,
                eclassrequirementname: requirement
            }
        });

        await ClassRequirement.query().where('eclasseclassid', classId).delete();

        await cls.$relatedQuery('requirements', trx)
            .insertToTable(classRequirements, user.sub);

        return cls.$query(trx).updateByUserId(classDTO, user.sub).returning('*')
        .withGraphFetched('[company(baseAttributes), industry(baseAttributes), requirements(baseAttributes)]');

    });
}

mobileClassService.deleteClassById = async (classId) => {

    return Class.query()
        .findById(classId)
        .delete()
        .then(rowsAffected => rowsAffected === 1)
}

module.exports = mobileClassService