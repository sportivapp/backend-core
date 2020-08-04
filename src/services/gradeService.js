const Grade = require('../models/Grades')
const companyService = require('./companyService')
const ServiceHelper = require('../helper/ServiceHelper')

const gradeService = {}

gradeService.getAllGrades = async (page, size) => {
    const gradePage = await Grade.query()
        .page(page, size)
    return ServiceHelper.toPageObj(page, size, gradePage)
}

gradeService.getGradeById = async (gradeId) => {
    return Grade.query().findById(gradeId)
}

gradeService.createGrade = async (gradeDTO) => {

    // if (gradeDTO.egradesuperiorid) {
    //     const grade = await gradeService.getGradeById(gradeDTO.egradesuperiorid)
    //     if (!grade) return
    // }
    //
    // if (gradeDTO.ecompanycompanyid) {
    //     const company = await companyService.getCompanyById(gradeDTO.ecompanycompanyid)
    //     if (!company) return
    // }

    return Grade.query().insert(gradeDTO)
}

gradeService.updateGradeById = async (gradeId, gradeDTO) => {
    const grade = await gradeService.getGradeById(gradeId)
    return grade.$query().patchAndFetch(gradeDTO)
}

gradeService.deleteGradeById = async (gradeId) => {
    const grade = await gradeService.getGradeById(gradeId)

    if (!grade)
        return false

    if (grade.epermitstatus > 1)
        return false

    const rowsAffected = await Grade.query().delete().where('egradeid', gradeId)
    return rowsAffected === 1
}

module.exports = gradeService