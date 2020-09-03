const projectService = require('../../services/projectService');
const ResponseHelper = require('../../helper/ResponseHelper');

const projectController = {};

projectController.createProject = async (req, res, next) => {

    if (req.user.functions.indexOf('C10') === -1)
        return res.status(403).json(ResponseHelper.toErrorResponse(403))

    try {

        const { code, name, startDate, endDate, address, description, parentId } = req.body;

        const projectDTO = { 
            eprojectcode: code, 
            eprojectname: name,
            eprojectstartdate: startDate, 
            eprojectenddate: endDate,
            eprojectaddress: address,
            eprojectdescription: description,
            eprojectsupervisorid: req.user.sub,
            eprojectparentid: parentId
        }

        const project = await projectService.createProject(projectDTO, req.user);
        if (!project) return res.status(400).json(ResponseHelper.toErrorResponse(400))
        return res.status(200).json(ResponseHelper.toBaseResponse(project));

    } catch(e) {
        next(e);
    }

}

projectController.getProjectById = async (req, res, next) => {

    if (req.user.functions.indexOf('R10') === -1)
        return res.status(403).json(ResponseHelper.toErrorResponse(403))

    const { projectId } = req.params;

    try {

        const result = await projectService.getProjectById(projectId);

        if (!result)
            return res.status(404).json(ResponseHelper.toErrorResponse(404))
        return res.status(200).json(ResponseHelper.toBaseResponse(result))

    } catch(e) {
        next(e);
    }

}

projectController.deleteProjectById = async (req, res, next) => {

    const user = req.user;
    const { projectId } = req.params;

    if (user.functions.indexOf('D10') === -1)
        return res.status(403).json(ResponseHelper.toErrorResponse(403))

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

    const user = req.user;
    const { projectId } = req.params;
    const { code, name, startDate, endDate, address, description } = req.body;

    if (user.functions.indexOf('U10') === -1)
        return res.status(403).json(ResponseHelper.toErrorResponse(403))

    const projectDTO = { 
        eprojectcode: code, 
        eprojectname: name,
        eprojectstartdate: startDate, 
        eprojectenddate: endDate,
        eprojectaddress: address,
        eprojectdescription: description
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

    const user = req.user;
    const { page, size } = req.query

    if (user.functions.indexOf('R10') === -1)
        return res.status(403).json(ResponseHelper.toErrorResponse(403))

    try {

        const pageObj = await projectService.getProjects(user.sub, parseInt(page), parseInt(size));

        return res.status(200).json(ResponseHelper.toPageResponse(pageObj.data, pageObj.paging))

    } catch(e) {
        next(e);
    }
}

projectController.saveDevicesIntoProject = async (req, res, next) => {

    const { deviceIds } = req.body;
    const { projectId } = req.params;
    const user = req.user;

    if (user.functions.indexOf('C10') === -1)
        return res.status(403).json(ResponseHelper.toErrorResponse(403))

    try {

        const deviceList = await projectService.saveDevicesIntoProject(projectId, deviceIds, user)

        return res.status(200).json(ResponseHelper.toBaseResponse(deviceList))
        
    } catch(e) {
        next(e)
    }
}

projectController.getDevicesByProjectId = async (req, res, next) => {

    const { page, size } = req.query
    const { projectId } = req.params

    if (req.user.functions.indexOf('R10') === -1)
        return res.status(403).json(ResponseHelper.toErrorResponse(403))

    try {

        const pageObj = await projectService.getDevicesByProjectId(projectId, page, size)

        return res.status(200).json(ResponseHelper.toPageResponse(pageObj.data, pageObj.paging))

    } catch(e) {
        next(e)
    }
}

projectController.saveTimesheet = async (req, res, next) => {

    const { timesheetIds } = req.body

    const { projectId } = req.params

    if (req.user.functions.indexOf('C10') === -1)
        return res.status(403).json(ResponseHelper.toErrorResponse(403))

    try {
        const result = await projectService.saveTimesheetIntoProject(projectId, timesheetIds, req.user)
        if (!result) return res.status(404).json(ResponseHelper.toErrorResponse(404))
        return res.status(200).json(ResponseHelper.toBaseResponse(result))
    } catch (e) {
        next(e)
    }
}

module.exports = projectController;