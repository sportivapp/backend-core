const Class = require('../models/Class')
const Industry = require('../models/Industry')
const Company = require('../models/Company')
const ServiceHelper = require('../helper/ServiceHelper')
const { NotFoundError, UnsupportedOperationError } = require('../models/errors')

const classService = {}

classService.createClass = async (classDTO, user) => {

    const industry = await Industry.query().findById(classDTO.eindustryeindustryid)

    const company = await Company.query().findById(classDTO.ecompanyecompanyid)

    if (!company) throw new UnsupportedOperationError('COMPANY_NOT_FOUND')

    if (!industry) throw new UnsupportedOperationError('INDUSTRY_NOT_FOUND')

    return Class.query().insertToTable(classDTO, user.sub)
}

classService.getAllClassByCompanyId = async (companyId, page, size) => {

    if (!companyId) return ServiceHelper.toEmptyPage(page, size)

    return Class.query()
        .where('ecompanyecompanyid', companyId)
        .withGraphFetched('[company(baseAttributes), industry(baseAttributes)]')
        .page(page, size)
        .then(pageObj => ServiceHelper.toPageObj(page, size, pageObj))
}

classService.getClassById = async (classId) => {

    return Class.query()
        .findById(classId)
        .withGraphFetched('[company(baseAttributes), industry(baseAttributes)]')
        .catch(ignored => throw new NotFoundError())
}

classService.updateClassById = async (classId, classDTO, user) => {

    const industry = await Industry.query().findById(classDTO.eindustryeindustryid)

    if (!industry) throw new UnsupportedOperationError('INDUSTRY_NOT_FOUND')

    return classService.getClassById(classId)
        .then(foundClass => foundClass.$query().updateByUserId(classDTO, user.sub).returning('*'))
}

classService.deleteClassById = async (classId) => {

    return Class.query()
        .findById(classId)
        .delete()
        .then(rowsAffected => rowsAffected === 1)
}

module.exports = classService