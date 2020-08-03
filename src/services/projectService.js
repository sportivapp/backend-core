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

    const devices = deviceIds
        .map(deviceId => ({
            eprojectprojectid: parseInt(projectId),
            edevicedeviceid: deviceId}))

    await ProjectDeviceMapping.query().delete()
        .where('eprojectprojectid', projectId)

    return ProjectDeviceMapping.query().insert(devices)
}

module.exports = ProjectService;