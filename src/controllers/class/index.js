const classService = require('../../services/classService')
const ResponseHelper = require('../../helper/ResponseHelper')



const classController = {}

classController.createClass = async(req,res,next) => {

    const { name, description, startDate, endDate, type, price, address, picName, picMobileNumber, 
        industryId, companyId, requirements, fileId } = req.body
    
    const classDTO = {
        eclassname: name,
        eclassdescription: description,
        eclassstartdate: startDate,
        eclassenddate: endDate,
        eclassprice: price,
        eclasstype: type,
        eclassaddress: address,
        eclasspicname: picName,
        eclasspicmobilenumber: picMobileNumber,
        eindustryeindustryid: industryId,
        ecompanyecompanyid: companyId,
        efileefileid: fileId,
        requirements: requirements
    }

    try {

        const result = await classService.createClass(classDTO, requirements, req.user)
        return res.status(200).json(ResponseHelper.toBaseResponse(result))

    } catch(e) {
        next(e)
    }
}


classController.getClassById = async (req, res, next) => {

    const { classId } = req.params

    try {

        const result = await classService.getClassById(classId, req.user)
        return res.status(200).json(ResponseHelper.toBaseResponse(result))
    } catch(e) {
        next(e)
    }
}


classController.updateClassById = async (req, res, next) => {

    const { name, description, startDate, endDate, type, price, address, picName, picMobileNumber, 
        industryId, requirements, fileId } = req.body

    const { classId } = req.params

    const classDTO = {
        eclassname: name,
        eclassdescription: description,
        eclassstartdate: startDate,
        eclassenddate: endDate,
        eclassprice: price,
        eclasstype: type,
        eclassaddress: address,
        eclasspicname: picName,
        eclasspicmobilenumber: picMobileNumber,
        eindustryeindustryid: industryId,
        efileefileid: fileId,
        requirements: requirements
    }

    try {

        const result = await classService.updateClassById(classId, classDTO, requirements, req.user)
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

classController.getAllClassByCompanyId = async (req, res, next) => {

    const { companyId = null, page = '0', size = '10', keyword = '' } = req.query



    try {

        const pageObj = await classService.getAllClassByCompanyId(companyId, parseInt(page), parseInt(size), keyword,req.user)
        return res.status(200).json(ResponseHelper.toPageResponse(pageObj.data, pageObj.paging))
    } catch(e) {
        next(e)
    }
}



module.exports = classController

