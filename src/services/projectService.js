const Project = require('../models/Project');

const ProjectService = {};

ProjectService.createProject = async(projectDTO) => {

    const project = await Project.query().insert(projectDTO);

    return project;

}

module.exports = ProjectService;