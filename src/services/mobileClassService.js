const Class = require('../models/Class')
const ClassUserMapping = require('../models/ClassUserMapping')
const Industry = require('../models/Industry')
const Company = require('../models/Company')
const ClassRequirement = require('../models/ClassRequirement')
const ServiceHelper = require('../helper/ServiceHelper')
const { NotFoundError, UnsupportedOperationError } = require('../models/errors')
const ClassTypeEnum = require('../models/enum/ClassTypeEnum')
const { raw } = require('objection')

const mobileClassService = {}

mobileClassService.createClass = async (classDTO, requirements, user) => {

    const industry = await Industry.query().findById(classDTO.eindustryeindustryid)

    const company = await Company.query().findById(classDTO.ecompanyecompanyid)

    if (!company) throw new UnsupportedOperationError('COMPANY_NOT_FOUND')

    if (!industry) throw new UnsupportedOperationError('INDUSTRY_NOT_FOUND')

    if (!ClassTypeEnum.hasOwnProperty(classDTO.eclasstype)) throw new UnsupportedOperationError('TYPE_INVALID')

    if (ClassTypeEnum.PRIVATE === classDTO.eclasstype && !classDTO.ecompanyecompanyid)
        throw new UnsupportedOperationError('TYPE_INVALID')

    return Class.transaction(async trx => {

        const cls = await Class.query(trx)
            .insertToTable(classDTO, user.sub);

        const classRequirements = requirements.map(requirement => {
            return {
                eclasseclassid: cls.eclassid,
                eclassrequirementname: requirement
            }
        });

        await cls.$relatedQuery('requirements', trx)
            .insertToTable(classRequirements, user.sub);

        return cls;

    });

}

mobileClassService.getAllClassByCompanyId = async (companyId, page, size, keyword) => {

    if (companyId < 1) companyId = null

    let pageQuery = Class.query()

    if (companyId !== null) pageQuery = pageQuery.where('ecompanyecompanyid', companyId)

    return pageQuery
        .andWhere(raw('lower("eclassname")'), 'like', `%${keyword.toLowerCase()}%`)
        .modify('baseAttributes')
        .withGraphFetched('[company(baseAttributes), industry(baseAttributes)]')
        .page(page, size)
        .then(pageObj => ServiceHelper.toPageObj(page, size, pageObj))
}

mobileClassService.getClassById = async (classId, user) => {

    const classUser = await ClassUserMapping.query()
        .where('eclasseclassid', classId)
        .andWhere('eusereuserid', user.sub)
        .withGraphFetched('class')
        .first()

    if (classUser) {

        return {
            ...classUser.class,
            eclassusermappingid: classUser.eclassusermappingid,
            eclassusermappingstatus: classUser.eclassusermappingstatus
        }

    } else

        return Class.query()
            .findById(classId)
            .modify('baseAttributes')
            .withGraphFetched('[company(baseAttributes), industry(baseAttributes), requirements(baseAttributes)]')
            .then(foundClass => {
                if (!foundClass) throw new NotFoundError()
                return foundClass
            })
}

mobileClassService.updateClassById = async (classId, classDTO, requirements, user) => {

    console.log(user);

    const industry = await Industry.query().findById(classDTO.eindustryeindustryid)

    if (!industry) throw new UnsupportedOperationError('INDUSTRY_NOT_FOUND')

    if (!ClassTypeEnum.hasOwnProperty(classDTO.eclasstype)) throw new UnsupportedOperationError('TYPE_INVALID')

    const cls = await mobileClassService.getClassById(classId);    

    return Class.transaction(async trx => {

        const classRequirements = requirements.map(requirement => {
            return {
                eclasseclassid: cls.eclassid,
                eclassrequirementname: requirement
            }
        });

        await ClassRequirement.query().where('eclasseclassid', classId).delete();

        console.log(user);
        await cls.$relatedQuery('requirements', trx)
            .insertToTable(classRequirements, user.sub);

        console.log(user);
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