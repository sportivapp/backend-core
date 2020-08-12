const Project = require('../models/Project');
const ProjectDeviceMapping = require('../models/ProjectDeviceMapping')
const ServiceHelper = require('../helper/ServiceHelper')

const ProjectService = {};

ProjectService.createProject = async(projectDTO) => {

    return Project.query().insert(projectDTO);

}

ProjectService.getProjectById = async (projectId) => {

    return Project.query().findById(projectId)

}

ProjectService.getProjects = async(userId, page, size) => {
    
    const projectPage = await Project.query()
    .select('eprojectid', 'eprojectname', 'eprojectcode', 'eprojectstartdate', 'eprojectenddate', 'eprojectaddress')
    .where('eprojectcreateby', userId)
    .page(page, size);

    return ServiceHelper.toPageObj(page, size, projectPage);

}

ProjectService.updateProjectById = async(projectId, projectDTO, user) => {

    const project = await ProjectService.getProjectById(projectId);

    return project.$query().updateByUserId(projectDTO, user.sub);

}

ProjectService.deleteProjectById = async(projectId, user) => {

    await ProjectDeviceMapping.query().delete().where('eprojecteprojectid', projectId)
    const affectedRow = await Project.query().deleteByUserId(user.sub)
    return affectedRow === 1

}

ProjectService.getDevicesByProjectId = async (projectId, page, size) => {

    const project = await Project.query().findById(projectId)

    if (!project)
        return

    const projectPage = await project.$relatedQuery('devices')
        .modify('notDeleted')
        .page(page, size)

    return ServiceHelper.toPageObj(page, size, projectPage)
}

ProjectService.saveDevicesIntoProject = async (projectId, deviceIds, user) => {

    const existedRelations = await ProjectDeviceMapping.query()
        .where('eprojectprojectid', projectId)
        .where('eprojectdevicemappingdeletestatus', false)

    let sameRelations = []

    const devices = deviceIds
        .map(deviceId => ({
            eprojectdevicemappingcreateby: user.sub,
            eprojectprojectid: parseInt(projectId),
            edevicedeviceid: deviceId}))
        .filter(device => {

            let existed = existedRelations
                .find(dv => findByProjectIdAndDeviceId(dv, device))
            //if device relation already exist in DB, push to sameRelations array
            if(existed) sameRelations.push(device)
            return !existed
        })

    //search for device relations to be deleted
    const removedDevices = existedRelations
        .filter(relation => !(sameRelations.find(dc => findByProjectIdAndDeviceId(dc, relation))))
        .map(relation => relation.edevicedeviceid)

    //Create query to delete items from removedDevices array
    const deleteExistingDevices = ProjectDeviceMapping.query()
        .deleteByUserId(user.sub)
        .where('eprojectprojectid', projectId)
        .whereIn('edevicedeviceid', removedDevices)

    //If there are new devices to be inserted
    if(devices.length > 0) {

        //create query to search the database for deleted devices with the same projectId and deviceId
        const selectDeletedDevices = ProjectDeviceMapping.query()
            .where('eprojectprojectid', projectId)
            .where('eprojectdevicemappingdeletestatus', true)
            .whereIn('edevicedeviceid', devices.map(obj => obj.edevicedeviceid))

        //Create query to insert devices
        const insertNewDevices = (devices) => ProjectDeviceMapping.query().insert(devices)

        //Run deleteExistingDevices query and selectDeletedDevices query asynchronously
        //After those 2 query is done, will take the result of selectDeletedDevices query
        //The result of selectDeletedDevices query is deletedDevices array which will be used for filtering new devices to be inserted
        //Then create new query for undo deletion and insertion of the new devices
        //The result of undo deletion query will be rowsAffected and so, map the result to return deletedDevices array
        //Run those queries asynchronously again and then add both results to existedRelations array
        //Addition to existedRelations array is to return all of the projects that was requested -> deviceIds.length == returnedProjects.length
        return Promise.all([deleteExistingDevices, selectDeletedDevices])
            .then(resultArr => resultArr[1])
            .then(deletedDevices => {
                const filteredDevices = devices
                    .filter(device => !(deletedDevices.find(dc => findByProjectIdAndDeviceId(dc, device))))
                return [deletedDevices, filteredDevices]
            })
            .then(arr => {
                const undoDeletedDevices =  selectDeletedDevices
                    .patch({ eprojectdevicemappingdeletestatus: false })
                    .then(ignored => arr[0])
                return Promise.all([undoDeletedDevices, insertNewDevices(arr[1])])
                    .then(resultArr => {
                        existedRelations.push(...resultArr[0])
                        existedRelations.push(...resultArr[1])
                        return existedRelations
                    })
            })

    } else {
        return deleteExistingDevices
            .then(ignored => sameRelations)
    }
}

function findByProjectIdAndDeviceId(pr, project) {
    return pr.eprojectprojectid === project.eprojectprojectid && pr.edevicedeviceid === project.edevicedeviceid
}

module.exports = ProjectService;