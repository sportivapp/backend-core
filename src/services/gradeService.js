const Grade = require('../models/Grades')
const Company = require('../models/Company')
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

    if (gradeDTO.egradesuperiorid) {
        const superior = await gradeService.getGradeById(gradeDTO.egradesuperiorid)
        if (!superior) return
    }

    const company = await Company.query().findById(gradeDTO.ecompanycompanyid)
    if (!company) return

    return Grade.query().insert(gradeDTO)
}

gradeService.updateGradeById = async (gradeId, gradeDTO) => {

    if (gradeDTO.egradesuperiorid) {
        const superior = await gradeService.getGradeById(gradeDTO.egradesuperiorid)
        if (!superior) return
    }

    if (gradeDTO.ecompanycompanyid) {
        const company = await Company.query().findById(gradeDTO.ecompanycompanyid)
        if (!company) return
    }
    const grade = await gradeService.getGradeById(gradeId)
    return grade.$query().patchAndFetch(gradeDTO)
}

gradeService.deleteGradeById = async (gradeId) => {

    return Grade.query()
        .delete()
        .where('egradeid', gradeId)
        .then(rowsAffected => rowsAffected === 1)
}

module.exports = gradeService