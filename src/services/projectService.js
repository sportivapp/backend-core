const Project = require('../models/Project');

const ProjectService = {};

ProjectService.createProject = async(projectDTO) => {

    const project = await Project.query().insert(projectDTO);

    return project;

}

ProjectService.getProjects = async(userId) => {

    const projects = await Project.query().where('eprojectcreateby', userId);

    return projects;

}

module.exports = ProjectService;