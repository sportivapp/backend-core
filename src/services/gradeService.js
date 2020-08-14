const Grade = require('../models/Grades')
const User = require('../models/User')
const Company = require('../models/Company')
const UserPositionMapping = require('../models/UserPositionMapping')
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

    const company = await Company.query().findById(gradeDTO.ecompanyecompanyid)
    if (!company) return

    return Grade.query().insert(gradeDTO)
}

gradeService.updateGradeById = async (gradeId, gradeDTO) => {

    if (gradeDTO.egradesuperiorid) {
        const superior = await gradeService.getGradeById(gradeDTO.egradesuperiorid)
        if (!superior) return
    }

    if (gradeDTO.ecompanyecompanyid) {
        const company = await Company.query().findById(gradeDTO.ecompanyecompanyid)
        if (!company) return
    }
    const grade = await gradeService.getGradeById(gradeId)
    return grade.$query().patchAndFetch(gradeDTO)
}

gradeService.deleteGradeById = async (gradeId, user) => {

    const grade = await Grade.query().select().where('egradeid', gradeId).first()
    
    if(!grade)
        return false

    const superior = await Grade.query().select()
    .where('egradeid', grade.egradesuperiorid)
    .andWhere('ecompanyecompanyid', grade.ecompanyecompanyid)
    .first()

    const subordinates = await Grade.query().select().where('egradesuperiorid', grade.egradeid)

    if ( grade.egradesuperiorid !== null) {

        for( subordinate in subordinates){
            await Grade.query()
            .where('egradeid', subordinates[subordinate].egradeid)
            .updateByUserId({egradesuperiorid: superior.egradeid}, user.sub)
        }

    } else {
        for( subordinate in subordinates){
            await Grade.query()
            .where('egradeid', subordinates[subordinate].egradeid)
            .updateByUserId({egradesuperiorid: null}, user.sub)
        }
    }

    return Grade.query()
        .delete()
        .where('egradeid', gradeId)
        .then(rowsAffected => rowsAffected === 1)
}

gradeService.saveUserPositions = async (userId, positionIds, user) => {

    await UserPositionMapping.query()
    .where('eusereuserid', userId).delete()

    const positions = positionIds.map(position => 
        ({ 
            eusereuserid: userId,
            egradeegradeid: position
        }));  

    return UserPositionMapping.query()
    .insertToTable(positions, user.sub)

}

module.exports = gradeService