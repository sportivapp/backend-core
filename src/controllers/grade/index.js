const gradeService = require('../../services/gradeService')
const ResponseHelper = require('../../helper/ResponseHelper')

const controller = {}

controller.getGrades = async (req, res, next) => {

    if (req.user.functions.indexOf('R4') === -1)
        return res.status(403).json(ResponseHelper.toErrorResponse(403))

    const { page = '0', size = '10', companyId, departmentId } = req.query

    try {
        const pageObj = await gradeService.getAllGrades(parseInt(page), parseInt(size), companyId, departmentId)
        return res.status(200).json(ResponseHelper.toPageResponse(pageObj.data, pageObj.paging))
    } catch (e) {
        next(e)
    }
}

controller.getGradeById = async (req, res, next) => {

    const { gradeId } = req.params

    if (req.user.functions.indexOf('R4') === -1)
        return res.status(403).json(ResponseHelper.toErrorResponse(403))

    try {
        const grade = await gradeService.getGradeById(gradeId)
        return res.status(200).json(ResponseHelper.toBaseResponse(grade))
    }catch (e) {
        next(e)
    }
}

controller.createGrade = async (req, res, next) => {

    const request = req.body

    const user = req.user

    if (user.functions.indexOf('C4') === -1)
        return res.status(403).json(ResponseHelper.toErrorResponse(403))

    let gradeDTO = {
        egradename: request.name,
        egradedescription: request.description,
        ecompanyecompanyid: request.companyId,
        edepartmentedepartmentid: request.departmentId
    }

    request.superiorId ? gradeDTO = {
        ...gradeDTO,
        egradesuperiorid: request.superiorId,
    } : gradeDTO

    try {
        const grade = await gradeService.createGrade(gradeDTO, user.sub)
        return res.status(200).json(ResponseHelper.toBaseResponse(grade))
    } catch (e) {
        next(e)
    }
}

controller.updateGradeById = async (req, res, next) => {

    const { gradeId } = req.params

    const request = req.body

    const user = req.user

    if (user.functions.indexOf('U4') === -1)
        return res.status(403).json(ResponseHelper.toErrorResponse(403))

    const gradeDTO = {
        egradename: request.name,
        egradecreateby: user.sub,
        egradedescription: request.description,
        egradesuperiorid: request.superiorId,
        edepartmentedepartmentid: request.departmentId,
        ecompanyecompanyid: request.companyId
    }

    try {
        const grade = await gradeService.updateGradeById(gradeId, gradeDTO, req.user)
        return res.status(200).json(ResponseHelper.toBaseResponse(grade))
    } catch (e) {
        next(e)
    }
}

controller.deleteGradeById = async (req, res, next) => {

    const { gradeId } = req.params
    const user = req.user

    if (user.functions.indexOf('D4') === -1)
        return res.status(403).json(ResponseHelper.toErrorResponse(403))

    try {
        const result = await gradeService.deleteGradeById(gradeId, user)
        return res.status(200).json(ResponseHelper.toBaseResponse(result))
    } catch (e) {
        next(e)
    }
}

controller.saveUserPositions = async (req, res, next) => {

    const user = req.user

    const { positionId, userIds } = req.body

    if (user.functions.indexOf('C4') === -1)
        return res.status(403).json(ResponseHelper.toErrorResponse(403))

    try {
        const result = await gradeService.saveUserPositions(userIds, parseInt(positionId), user)
        return res.status(200).json(ResponseHelper.toBaseResponse(result))
    } catch (e) {
        next(e)
    }
}

controller.getUsersByPositionId = async (req, res, next) => {

    const { page = '0', size = '10' } = req.query

    const { gradeId } = req.params

    if (req.user.functions.indexOf('R4') === -1)
        return res.status(403).json(ResponseHelper.toErrorResponse(403))

    try {
        const pageObj = await gradeService.getUsersByPositionId(parseInt(page), parseInt(size), gradeId)
        return res.status(200).json(ResponseHelper.toPageResponse(pageObj.data, pageObj.paging))
    } catch (e) {
        next(e)
    }

}

module.exports = controller