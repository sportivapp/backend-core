const projectService = require('../../services/projectService');
const ResponseHelper = require('../../helper/ResponseHelper');

const projectController = {};

function isUserNotValid(user) {
    return user.permission !== 8 && user.permission !== 10
}

projectController.createProject = async (req, res, next) => {

    if (isUserNotValid(req.user))
        return res.status(403).json(ResponseHelper.toErrorResponse(403))

    try {

        const { code, name, startDate, endDate, address } = req.body;
        const user = req.user;

        const projectDTO = { 
            eprojectcode: code, 
            eprojectname: name,
            eprojectstartdate: startDate, 
            eprojectenddate: endDate, 
            eprojectcreateby: user.sub,
            eprojectaddress: address
        }

        const project = await projectService.createProject(projectDTO);

        return res.status(200).json({
            data: project
        });

    } catch(e) {
        next(e);
    }

}

projectController.deleteProjectById = async (req, res, next) => {

    if (isUserNotValid(req.user))
        return res.status(403).json(ResponseHelper.toErrorResponse(403))

    const user = req.user;
    const { projectId } = req.params;

    try {

        const result = await projectService.deleteProjectById(projectId, user);

        if (!result)
            return res.status(400).json(ResponseHelper.toErrorResponse(400))
        return res.status(200).json(ResponseHelper.toBaseResponse(result))

    } catch(e) {
        next(e);
    }

}

projectController.updateProjectById = async (req, res, next) => {

    if (isUserNotValid(req.user))
        return res.status(403).json(ResponseHelper.toErrorResponse(403))

    const user = req.user;
    const { projectId } = req.params;
    const { code, name, startDate, endDate, address } = req.body;
    const projectDTO = { 
        eprojectcode: code, 
        eprojectname: name,
        eprojectstartdate: startDate, 
        eprojectenddate: endDate,
        eprojectaddress: address
    }

    try {
        const project = await projectService.updateProjectById(projectId, projectDTO, user);

        if (!project)
            return res.status(404).json(ResponseHelper.toErrorResponse(404))
        return res.status(200).json(ResponseHelper.toBaseResponse(project))

    } catch(e) {
        next(e);
    }
}

projectController.getProjects = async (req, res, next) => {

    try {

        if (isUserNotValid(req.user))
            return res.status(403).json(ResponseHelper.toErrorResponse(403))

        const user = req.user;
        const { page, size } = req.query
        const userId = user.sub;

        const pageObj = await projectService.getProjects(userId, parseInt(page), parseInt(size));

        return res.status(200).json(ResponseHelper.toPageResponse(pageObj.data, pageObj.paging))

    } catch(e) {
        next(e);
    }
}

projectController.saveDevicesIntoProject = async (req, res, next) => {

    try {

        if (isUserNotValid(req.user))
            return res.status(403).json(ResponseHelper.toErrorResponse(403))

        const { deviceIds } = req.body;
        const { projectId } = req.params;
        const user = req.user;

        const deviceList = await projectService.saveDevicesIntoProject(projectId, deviceIds, user)

        return res.status(200).json(ResponseHelper.toBaseResponse(deviceList))
        
    } catch(e) {
        next(e)
    }
}

projectController.getDevicesByProjectId = async (req, res, next) => {

    try {

        if (isUserNotValid(req.user))
            return res.status(403).json(ResponseHelper.toErrorResponse(403))

        const { page, size } = req.query
        const { projectId } = req.params

        const pageObj = await projectService.getDevicesByProjectId(projectId, page, size)

        return res.status(200).json(ResponseHelper.toPageResponse(pageObj.data, pageObj.paging))

    } catch(e) {
        next(e)
    }
}

module.exports = projectController;