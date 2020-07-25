const Project = require('../models/Project');

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

module.exports = ProjectService;