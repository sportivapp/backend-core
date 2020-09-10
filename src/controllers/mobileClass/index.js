const classService = require('../../services/mobileClassService')
const ResponseHelper = require('../../helper/ResponseHelper')

const classController = {}

classController.createClass = async (req, res, next) => {
    
    const { name, requirement, description, startDate, endDate, type, price, address, industryId, companyId } = req.body
    
    const classDTO = {
        eclassname: name,
        eclassrequirement: requirement,
        eclassdescription: description,
        eclassstartdate: startDate,
        eclassenddate: endDate,
        eclassprice: price,
        eclasstype: type,
        eclassaddress: address,
        eindustryeindustryid: industryId,
        ecompanyecompanyid: companyId,
        eclasssupervisorid: req.user.sub
    }

    try {

        const result = await classService.createClass(classDTO, req.user)
        return res.status(200).json(ResponseHelper.toBaseResponse(result))
    } catch(e) {
        next(e)
    }
}

classController.getAllClassByCompanyId = async (req, res, next) => {

    const { companyId = null, page = '0', size = '10', keyword = '' } = req.query

    try {

        const pageObj = await classService.getAllClassByCompanyId(companyId, parseInt(page), parseInt(size), keyword)
        return res.status(200).json(ResponseHelper.toPageResponse(pageObj.data, pageObj.paging))
    } catch(e) {
        next(e)
    }
}

classController.getClassById = async (req, res, next) => {

    const { classId } = req.params

    try {

        const result = await classService.getClassById(classId)
        return res.status(200).json(ResponseHelper.toBaseResponse(result))
    } catch(e) {
        next(e)
    }
}

classController.updateClassById = async (req, res, next) => {

    const { name, requirement, description, startDate, endDate, type, price, address, industryId, supervisorId } = req.body

    const { classId } = req.params

    const classDTO = {
        eclassname: name,
        eclassrequirement: requirement,
        eclassdescription: description,
        eclassstartdate: startDate,
        eclassenddate: endDate,
        eclassprice: price,
        eclasstype: type,
        eclassaddress: address,
        eindustryeindustryid: industryId,
        eclasssupervisorid: supervisorId ? supervisorId : req.user.sub
    }

    try {

        const result = await classService.updateClassById(classId, classDTO, req.user)
        return res.status(200).json(ResponseHelper.toBaseResponse(result))
    } catch (e) {
        next(e)
    }
}

classController.deleteClassById = async (req, res, next) => {

    const { classId } = req.params

    try {

        const result = await classService.deleteClassById(classId)
        return res.status(200).json(ResponseHelper.toBaseResponse(result))
     } catch(e) {
        next(e)
    }
}

module.exports = classController