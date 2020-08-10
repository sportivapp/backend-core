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


    
    const deleteRelationsQuery = UserPositionMapping.query()
        .deleteByUserId(loggedInUser.sub)
        .where('eusereuserid', userId)
        .whereIn('egradeegradeid', deletedPositionIds)

    const selectPositionIdsByDeleteStatusQuery = (status) => UserPositionMapping.query()
        .where('euserpositionmappingdeletestatus', status)
        .where('eusereuserid', userId)
        .whereIn('egradeegradeid', insertedPositionIds)

    const undoDeleteQuery = selectPositionIdsByDeleteStatusQuery(true)
        .unDeleteByUserId(loggedInUser.sub)

    const filterNewPositionIds = (existedIds) => {
        return insertedPositionIds
            .filter(positionId => !existedIds.find(id => id === positionId))
            .map(positionId => ({
                egradeegradeid: positionId,
                eusereuserid: parseInt(userId),
                euserpositionmappingcreateby: loggedInUser.sub
            }))
    }

    const getAllPositionsDataByUser = () => User.relatedQuery('grades')
    .for(userId)
    .modify({ euserpositionmappingdeletestatus: false })

    return Promise.all([deleteRelationsQuery, undoDeleteQuery])
    .then(ignored => selectPositionIdsByDeleteStatusQuery(false))
    .then(existedRelations => existedRelations.map(relation => relation.egradeegradeid))
    .then(existedIds => filterNewPositionIds(existedIds))
    .then(freshRelations => UserPositionMapping.query().insert(freshRelations))
    .then(ignored => getAllPositionsDataByUser())

}

module.exports = gradeService