const ProjectDeviceMapping = require('../models/ProjectDeviceMapping')
const Device = require('../models/Device')
const ServiceHelper = require('../helper/ServiceHelper')

const deviceService = {}

deviceService.getDevices = async (page, size) => {

    const devicePage = await Device.query()
        .page(page, size)
    return ServiceHelper.toPageObj(page, size, devicePage)
}

deviceService.getDeviceById = async (deviceId) => {

    return Device.query()
        .where('edeviceid', deviceId)
        .first()
}

deviceService.createDevice = async (deviceDTO) => {

    return Device.query().insert(deviceDTO)
}

deviceService.updateDevice = async (deviceId, deviceDTO) => {

    const device = await deviceService.getDeviceById(deviceId)

    if (!device)
        return
    else
        return device.$query().patchAndFetch(deviceDTO)
}

deviceService.deleteDevice = async (deviceId) => {

    // await ProjectDeviceMapping.query().delete().where('edevicedeviceid', deviceId)
    // const affectedRow = await Device.query().deleteById(deviceId)
    // return affectedRow === 1

    const device = await deviceService.getDeviceById(deviceId)

    if (!device)
        return
    else {
        const affectedRow = await Device.query().deleteById(deviceId);
        return affectedRow === 1
    }

}

deviceService.getProjectsByDeviceId = async (deviceId, page, size) => {

    const projectPage = await ProjectDeviceMapping.query()
        .where('edevicedeviceid', parseInt(deviceId))
        .page(page, size)
    return ServiceHelper.toPageObj(page, size, projectPage)
}

deviceService.saveProjectsIntoDevice = async (deviceId, projectIds, user) => {

    const existedRelations = await ProjectDeviceMapping.query()
        .where('edevicedeviceid', deviceId)
        .where('eprojectdevicemappingdeletestatus', false)

    let sameRelations = []

    const projects = projectIds
        .map(projectId => ({
            eprojectprojectid: projectId,
            eprojectdevicemappingcreateby: user.sub,
            edevicedeviceid: parseInt(deviceId)}))
        .filter(project => {
            let existed = existedRelations
                .find(pr => findByProjectIdAndDeviceId(pr, project))
            //if project relation already exist in DB, push to sameRelations array
            if(existed) sameRelations.push(project)
            return !existed
    })

    //search for project relations to be deleted
    const removedProjects = existedRelations
        .filter(relation => !(sameRelations.find(pr => findByProjectIdAndDeviceId(pr, relation))))
        .map(relation => relation.eprojectprojectid)

    //Create query to delete items from removedProjects array
    const deleteExistingProjects = ProjectDeviceMapping.query()
        .deleteByUserId(user.sub)
        .where('edevicedeviceid', deviceId)
        .whereIn('eprojectprojectid', removedProjects)

    //If there are new projects to be inserted
    if(projects.length > 0) {

        //create query to search the database for deleted projects with the same projectId and deviceId
        const selectDeletedProjects = ProjectDeviceMapping.query()
            .where('edevicedeviceid', deviceId)
            .where('eprojectdevicemappingdeletestatus', false)
            .whereIn('eprojectprojectid', projects.map(obj => obj.eprojectprojectid))

        //Create query to insert projects
        const insertNewProjects = (projects) => ProjectDeviceMapping.query().insert(projects)

        //Run deleteExistingProjects query and selectDeletedProjects query asynchronously
        //After those 2 query is done, will take the result of selectDeletedProjects query
        //The result of selectDeletedProjects query is deletedProjects array which will be used for filtering new projects to be inserted
        //Then create new query for undo deletion and insertion of the new projects
        //The result of undo deletion query will be rowsAffected and so, map the result to return deletedProjects array
        //Run those queries asynchronously again and then add both results to existedRelations array
        //Addition to existedRelations array is to return all of the projects that was requested -> projectIds.length == returnedProjects.length
        return Promise.all([deleteExistingProjects, selectDeletedProjects])
            .then(resultArr => resultArr[1])
            .then(deletedProjects => {
                const filteredProjects = projects
                    .filter(project => !(deletedProjects.find(pr => findByProjectIdAndDeviceId(pr, project))))
                return [deletedProjects, filteredProjects]
            })
            .then(arr => {
                const undoDeletedProjects =  selectDeletedProjects
                    .patch({ edeletestatus: false })
                    .then(ignored => arr[0])
                return Promise.all([undoDeletedProjects, insertNewProjects(arr[1])])
                    .then(resultArr => {
                        existedRelations.push(...resultArr[0])
                        existedRelations.push(...resultArr[1])
                        return existedRelations
                    })
            })

    } else {
        return deleteExistingProjects
            .then(ignored => sameRelations)
    }
}

function findByProjectIdAndDeviceId(pr, project) {
    return pr.eprojectprojectid === project.eprojectprojectid && pr.edevicedeviceid === project.edevicedeviceid
}

module.exports = deviceService