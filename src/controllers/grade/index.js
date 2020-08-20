const gradeService = require('../../services/gradeService')
const ResponseHelper = require('../../helper/ResponseHelper')

const controller = {}

controller.getGrades = async (req, res, next) => {

    const { page, size, companyId, departmentId } = req.query

    try {
        const pageObj = await gradeService.getAllGrades(parseInt(page), parseInt(size), companyId, departmentId)
        return res.status(200).json(ResponseHelper.toPageResponse(pageObj.data, pageObj.paging))
    } catch (e) {
        console.log(e)
        next(e)
    }
}

controller.getGradeById = async (req, res, next) => {

    const { gradeId } = req.params

    try {
        const grade = await gradeService.getGradeById(gradeId)
        if (!grade)
            return res.status(404).json(ResponseHelper.toErrorResponse(404))
        return res.status(200).json(ResponseHelper.toBaseResponse(grade))
    }catch (e) {
        next(e)
    }
}

controller.createGrade = async (req, res, next) => {

    const request = req.body

    const user = req.user

    if (!isUserAdmin(user))
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
        if (!grade)
            return res.status(400).json(ResponseHelper.toErrorResponse(400))
        return res.status(200).json(ResponseHelper.toBaseResponse(grade))
    } catch (e) {
        next(e)
    }
}

controller.updateGradeById = async (req, res, next) => {

    const { gradeId } = req.params

    const request = req.body

    const user = req.user

    if (!isUserAdmin(user))
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
        const grade = await gradeService.updateGradeById(gradeId, gradeDTO)
        if (!grade)
            return res.status(404).json(ResponseHelper.toErrorResponse(404))
        return res.status(200).json(ResponseHelper.toBaseResponse(grade))
    } catch (e) {
        next(e)
    }
}

controller.deleteGradeById = async (req, res, next) => {

    const { gradeId } = req.params
    const user = req.user

    if (!isUserAdmin(req.user))
        return res.status(403).json(ResponseHelper.toErrorResponse(403))

    try {
        const result = await gradeService.deleteGradeById(gradeId, user)
        if (!result)
            return res.status(400).json(ResponseHelper.toErrorResponse(400))
        return res.status(200).json(ResponseHelper.toBaseResponse(result))
    } catch (e) {
        next(e)
    }
}

function isUserAdmin(user) {
    return user.permission === 10
}

controller.saveUserPositions = async (req, res, next) => {

    const user = req.user

    const { positionIds, userId } = req.body

    if ( isNaN(userId) ) return res.status(400).json(ResponseHelper.toErrorResponse(400))

    try {
        const result = await gradeService.saveUserPositions(userId, positionIds, user)
        return res.status(200).json(ResponseHelper.toBaseResponse(result))
    } catch (e) {
        next(e)
    }
}

controller.getUsersByPositionId = async (req, res, next) => {

    const { page, size } = req.query

    const { gradeId } = req.params

    try {
        const pageObj = await gradeService.getUsersByPositionId(parseInt(page), parseInt(size), gradeId)
        return res.status(200).json(ResponseHelper.toPageResponse(pageObj.data, pageObj.paging))
    } catch (e) {
        next(e)
    }

}

module.exports = controller