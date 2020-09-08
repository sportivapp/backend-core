const Class = require('../models/Class')
const Industry = require('../models/Industry')
const Company = require('../models/Company')
const ServiceHelper = require('../helper/ServiceHelper')
const { NotFoundError, UnsupportedOperationError } = require('../models/errors')
const ClassTypeEnum = require('../models/enum/ClassTypeEnum')
const { raw } = require('objection')

const mobileClassService = {}

mobileClassService.createClass = async (classDTO, user) => {

    const industry = await Industry.query().findById(classDTO.eindustryeindustryid)

    const company = await Company.query().findById(classDTO.ecompanyecompanyid)

    if (!company) throw new UnsupportedOperationError('COMPANY_NOT_FOUND')

    if (!industry) throw new UnsupportedOperationError('INDUSTRY_NOT_FOUND')

    if (!ClassTypeEnum.hasOwnProperty(classDTO.eclasstype)) throw new UnsupportedOperationError('TYPE_INVALID')

    return Class.query().insertToTable(classDTO, user.sub)
}

mobileClassService.getAllClassByCompanyId = async (companyId, page, size, keyword) => {

    if (companyId < 1) companyId = null

    let pageQuery = Class.query()

    if (companyId !== null) pageQuery = pageQuery.where('ecompanyecompanyid', companyId)

    return pageQuery
        .andWhere(raw('lower("eclassname")'), 'like', `%${keyword.toLowerCase()}%`)
        .withGraphFetched('[company(baseAttributes), industry(baseAttributes)]')
        .page(page, size)
        .then(pageObj => ServiceHelper.toPageObj(page, size, pageObj))
}

mobileClassService.getClassById = async (classId) => {

    return Class.query()
        .findById(classId)
        .withGraphFetched('[company(baseAttributes), industry(baseAttributes)]')
        .then(foundClass => {
            if (!foundClass) throw new NotFoundError()
            return foundClass
        })
}

mobileClassService.updateClassById = async (classId, classDTO, user) => {

    const industry = await Industry.query().findById(classDTO.eindustryeindustryid)

    if (!industry) throw new UnsupportedOperationError('INDUSTRY_NOT_FOUND')

    if (!ClassTypeEnum.hasOwnProperty(classDTO.eclasstype)) throw new UnsupportedOperationError('TYPE_INVALID')

    return mobileClassService.getClassById(classId)
        .then(foundClass => foundClass.$query().updateByUserId(classDTO, user.sub).returning('*')
            .withGraphFetched('[company(baseAttributes), industry(baseAttributes)]'))
}

mobileClassService.deleteClassById = async (classId) => {

    return Class.query()
        .findById(classId)
        .delete()
        .then(rowsAffected => rowsAffected === 1)
}

module.exports = mobileClassService