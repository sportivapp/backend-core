const departmentService = require('../../services/departmentService')
const ResponseHelper = require('../../helper/ResponseHelper')

const controller = {}

function isUserNotValid( user ) {
    return user.permission !== 10
}

controller.getAllDepartmentbyCompanyId = async (req, res, next) => {
    
    const user = req.user

    if (isUserNotValid(user)) 
        return res.status(403).json(ResponseHelper.toErrorResponse(403))

    const { page, size, companyId } = req.query

    try {
        const pageObj = await departmentService.getAllDepartmentbyCompanyId(parseInt(page), parseInt(size), companyId)
        if (!pageObj)
            return res.status(404).json(ResponseHelper.toErrorResponse(404))
        return res.status(200).json(ResponseHelper.toPageResponse(pageObj.data, pageObj.paging))
    } catch (e) {
        next(e)
    }

}

controller.createDepartment = async (req, res, next) => {
    
    const user = req.user

    if (isUserNotValid(user)) 
        return res.status(403).json(ResponseHelper.toErrorResponse(403))

    const { departmentName, departmentDescription, departmentSuperiorId } = req.body

    try {

        const departmentDTO = {
            edepartmentname: departmentName,
            edepartmentdescription: departmentDescription,
            edepartmentcreateby: user.sub,
            edepartmentsuperiorid: departmentSuperiorId,
            ecompanyecompanyid: user.companyId
        }

        const result = await departmentService.createDepartment(departmentDTO, user)
        if (!result)
            return res.status(404).json(ResponseHelper.toErrorResponse(404))
        return res.status(200).json(ResponseHelper.toBaseResponse(result))

    } catch (e) {
        next(e)
    }

}

controller.updateDepartment = async (req, res, next) => {
    
    const user = req.user

    if (isUserNotValid(user)) 
        return res.status(403).json(ResponseHelper.toErrorResponse(403))

    const { departmentId } = req.params
    const { departmentName, departmentDescription, departmentSuperiorId } = req.body

    try {

        const departmentDTO = {
            edepartmentname: departmentName,
            edepartmentdescription: departmentDescription,
            edepartmentsuperiorid: departmentSuperiorId
        }

        const result = await departmentService.updateDepartment(departmentId, departmentDTO, user)
        if (!result)
            return res.status(404).json(ResponseHelper.toErrorResponse(404))
        return res.status(200).json(ResponseHelper.toBaseResponse(result))

    } catch (e) {
        next(e)
    }
}

controller.deleteDepartment = async (req, res, next) => {
    
    const user = req.user

    if (isUserNotValid(user)) 
        return res.status(403).json(ResponseHelper.toErrorResponse(403))

    const { departmentId } = req.params

    try {

        const result = await departmentService.deleteDepartment(departmentId)
        if (!result)
            return res.status(404).json(ResponseHelper.toErrorResponse(404))
        return res.status(200).json(ResponseHelper.toBaseResponse(result))

    } catch (e) {
        next(e)
    }

}

module.exports = controller