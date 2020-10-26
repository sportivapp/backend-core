const departmentService = require('../../services/departmentService')
const ResponseHelper = require('../../helper/ResponseHelper')

const controller = {}

controller.getAllDepartmentbyCompanyId = async (req, res, next) => {
    
    const user = req.user

    if (user.functions.indexOf('R3') === -1)
        return res.status(403).json(ResponseHelper.toErrorResponse(403))

    const { page = '0', size = '10', companyId, type, superiorId } = req.query

    try {
        const pageObj = await departmentService.getAllDepartmentbyCompanyId(parseInt(page), parseInt(size), type, companyId, superiorId)
        if (!pageObj)
            return res.status(404).json(ResponseHelper.toErrorResponse(404))
        return res.status(200).json(ResponseHelper.toPageResponse(pageObj.data, pageObj.paging))
    } catch (e) {
        next(e)
    }

}

controller.getDepartmentByDepartmentId = async (req, res, next) => {
    
    const user = req.user

    if (user.functions.indexOf('R3') === -1)
        return res.status(403).json(ResponseHelper.toErrorResponse(403))

    const { departmentId } = req.params

    try {
        const result = await departmentService.getDepartmentByDepartmentId(departmentId)
        return res.status(200).json(ResponseHelper.toBaseResponse(result))
    } catch (e) {
        next(e)
    }

}

controller.createDepartment = async (req, res, next) => {
    
    const user = req.user

    if (user.functions.indexOf('C3') === -1)
        return res.status(403).json(ResponseHelper.toErrorResponse(403))

    const { departmentName, departmentDescription, departmentSuperiorId, companyId } = req.body

    try {

        const departmentDTO = {
            edepartmentname: departmentName,
            edepartmentdescription: departmentDescription,
            edepartmentcreateby: user.sub,
            edepartmentsuperiorid: departmentSuperiorId,
            ecompanyecompanyid: companyId
        }

        const result = await departmentService.createDepartment(departmentDTO, user)
        return res.status(200).json(ResponseHelper.toBaseResponse(result))

    } catch (e) {
        next(e)
    }

}

controller.updateDepartment = async (req, res, next) => {
    
    const user = req.user

    if (user.functions.indexOf('U3') === -1)
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
        return res.status(200).json(ResponseHelper.toBaseResponse(result))

    } catch (e) {
        next(e)
    }
}

controller.deleteDepartment = async (req, res, next) => {
    
    const user = req.user

    if (user.functions.indexOf('D3') === -1)
        return res.status(403).json(ResponseHelper.toErrorResponse(403))

    const { departmentId } = req.params

    try {

        const result = await departmentService.deleteDepartment(departmentId)
        return res.status(200).json(ResponseHelper.toBaseResponse(result))

    } catch (e) {
        next(e)
    }

}

controller.getAllUsersByDepartmentId = async (req, res, next) => {

    const user = req.user

    if (user.functions.indexOf('R3') === -1)
        return res.status(403).json(ResponseHelper.toErrorResponse(403))

    const { page = '0', size = '10' } = req.query

    const { departmentId } = req.params

    try {
        const pageObj = await departmentService.getAllUsersWithinDepartment(parseInt(page), parseInt(size), departmentId)
        return res.status(200).json(ResponseHelper.toPageResponse(pageObj.data, pageObj.paging))
    } catch (e) {
        next(e)
    }

}

module.exports = controller