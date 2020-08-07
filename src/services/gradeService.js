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

gradeService.saveUserPositions = async (userId, positionIds, loggedInUser) => {

    //accepting model [{'id': 1, 'deleted': false/true}]
    
    const user = await User.query().findById(userId)

    if(!user)
        return

    const deletedPositionIds = positionIds.filter(position => position.deleted)
        .map(position => position.id)

    const insertedPositionIds = positionIds.filter(position => !position.deleted)
        .map(position => position.id)

    const deleteRelations = UserPositionMapping.query()
        .patch({
            edeletestatus: true,
            eassigndeleteby: loggedInUser.sub,
            eassigndeletetime: Date.now()
        })
        .where('eusereuserid', userId)
        .whereIn('egradeegradeid', deletedPositionIds)

    const undoDeletedPositions = UserPositionMapping.query()
        .patch({ edeletestatus: false })
        .where('edeletestatus', true)
        .where('eusereuserid', userId)
        .whereIn('egradeegradeid', insertedPositionIds)
        .returning('egradeegradeid')

    const existedPositions = UserPositionMapping.query()
        .select()
        .where('eusereuserid', userId)
        .returning('egradeegradeid')

    return Promise.all([deleteRelations, undoDeletedPositions, existedPositions])
        .then(resultArr => {
            console.log('passed')
            return resultArr[2]
        })
        .then(existedRelations => {
            console.log('passed')
            const freshRelations = insertedPositionIds
            .filter(positionId => !existedRelations.find(relation => relation.egradeegradeid === positionId))
            .map(positionId => ({
                eusereuserid: parseInt(userId),
                egradeegradeid: positionId,
                eassigncreateby: loggedInUser.sub
            }))
            return [freshRelations, existedRelations]
        })
        .then(relationArr => {

            return UserPositionMapping.query().insert(relationArr[0])
            .then(freshRelations => {
                let resultArr = []
                resultArr.push(...relationArr[1])
                resultArr.push(...freshRelations)
                return resultArr
            })
        })

}

module.exports = gradeService