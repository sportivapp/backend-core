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

    let sameRelations = []

    const devices = deviceIds
        .map(deviceId => ({
            eprojectprojectid: parseInt(projectId),
            edevicedeviceid: deviceId}))
        .filter(device => {

            let existed = existedRelations.indexOf(device)

            //if device relation already exist in DB, push to sameRelations array

            if(existed >= 0) {
                sameRelations.push(device)
                return false
            }
            return true
        })

    //search for device relations to be deleted
    const removedDevices = existedRelations
        .filter(relation => sameRelations.indexOf(relation) === -1)
        .map(relation => relation.edevicedeviceid)

    await ProjectDeviceMapping.query().delete()
        .where('eprojectprojectid', projectId)
        .whereIn('edevicedeviceid', removedDevices)

    if(devices.length > 0)
        return ProjectDeviceMapping.query().insert(devices)
    else
        return sameRelations
}

module.exports = ProjectService;