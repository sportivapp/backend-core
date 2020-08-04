const Project = require('../models/Project');
const ProjectDeviceMapping = require('../models/ProjectDeviceMapping')
const ServiceHelper = require('../helper/ServiceHelper')

const ProjectService = {};

ProjectService.createProject = async(projectDTO) => {

    const project = await Project.query().insert(projectDTO);

    return project;

}

ProjectService.getProjects = async(userId) => {

    const projects = await Project.query()
    .select('eprojectid', 'eprojectname', 'eprojectcode', 'eprojectstartdate', 'eprojectenddate', 'eprojectaddress')
    .where('eprojectcreateby', userId);

    return projects;

}

ProjectService.editProject = async(projectId, projectDTO) => {

    const project = await Project.query().update(projectDTO).where('eprojectid', projectId);

    return project;

}

ProjectService.deleteProject = async(projectId) => {

    const project = await Project.query().delete().where('eprojectid', projectId);

    return project;

}

ProjectService.getDevicesByProjectId = async (projectId, page, size) => {

    const projectPage = await ProjectDeviceMapping.query()
        .where('eprojectprojectid', projectId)
        .page(page, size)
    return ServiceHelper.toPageObj(page, size, projectPage)
}

ProjectService.saveDevicesIntoProject = async (projectId, deviceIds) => {

    const existedRelations = await ProjectDeviceMapping.query()
        .where('eprojectprojectid', projectId)
        .where('edeletestatus', false)

    let sameRelations = []

    const devices = deviceIds
        .map(deviceId => ({
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
        .patch({
            edeletestatus: true,
            eassigndeletetime: assignDate,
            eassigndeleteby: user.sub
        })
        .where('eprojectprojectid', projectId)
        .whereIn('edevicedeviceid', removedDevices)

    //If there are new devices to be inserted
    if(devices.length > 0) {

        //create query to search the database for deleted devices with the same projectId and deviceId
        const selectDeletedDevices = ProjectDeviceMapping.query()
            .where('eprojectprojectid', projectId)
            .where('edeletestatus', true)
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
                    .patch({ edeletestatus: false, eassigndate: assignDate })
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