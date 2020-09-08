const classService = require('../../services/mobileClassService')
const ResponseHelper = require('../../helper/ResponseHelper')

const classController = {}

classController.createClass = async (req, res, next) => {
    
    const { name, requirement, description, startDate, endDate, type, price, industryId, companyId } = req.body
    
    const classDTO = {
        eclassname: name,
        eclassrequirement: requirement,
        eclassdescription: description,
        eclassstartdate: startDate,
        eclassenddate: endDate,
        eclassprice: price,
        eclasstype: type,
        eindustryeindustryid: industryId,
        ecompanyecompanyid: companyId
    }

    return classService.createClass(classDTO, req.user)
        .then(ResponseHelper.toBaseResponse)
        .then(response => res.status(200).json(response))
        .catch(next)
}

classController.getAllClassByCompanyId = async (req, res, next) => {

    const { companyId, page, size } = req.query

    return classService.getAllClassByCompanyId(companyId, page, size)
        .then(pageObj => ResponseHelper.toPageResponse(pageObj.data, pageObj.paging))
        .then(response => res.status(200).json(response))
        .catch(next)
}

classController.getClassById = async (req, res, next) => {

    const { classId } = req.params

    return classService.getClassById(classId)
        .then(ResponseHelper.toBaseResponse)
        .then(response => res.status(200).json(response))
        .catch(next)
}

classController.updateClassById = async (req, res, next) => {

    const { name, requirement, description, startDate, endDate, type, price, industryId } = req.body

    const { classId } = req.params

    const classDTO = {
        eclassname: name,
        eclassrequirement: requirement,
        eclassdescription: description,
        eclassstartdate: startDate,
        eclassenddate: endDate,
        eclassprice: price,
        eclasstype: type,
        eindustryeindustryid: industryId
    }

    return classService.updateClassById(classId, classDTO, req.user)
        .then(ResponseHelper.toBaseResponse)
        .then(response => res.status(200).json(response))
        .catch(next)
}

classController.deleteClassById = async (req, res, next) => {

    const { classId } = req.params

    return classService.deleteClassById(classId)
        .then(ResponseHelper.toBaseResponse)
        .then(response => res.status(200).json(response))
        .catch(next)
}

module.exports = classController