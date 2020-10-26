const rosterService = require('../../services/rosterService')
const ResponseHelper = require('../../helper/ResponseHelper')

rosterController = {}

rosterController.createRoster = async (req, res, next) => {
    
    const { rosterName, rosterDescription, projectId, supervisorId, headUserId , userIds} = req.body;
    const user = req.user;

    if (user.functions.indexOf('C9') === -1)
        return res.status(403).json(ResponseHelper.toErrorResponse(403))

    try {

        const rosterDTO = { 
            erostername: rosterName, 
            erosterdescription: rosterDescription,
            eprojecteprojectid: projectId,
            erostersupervisoruserid: supervisorId, 
            erosterheaduserid: headUserId, 
            erostercreateby: user.sub
        }

        const result = await rosterService.createRoster(rosterDTO, userIds, user);

        if (!result)
            return res.status(400).json(ResponseHelper.toErrorResponse(400))
        return res.status(200).json(ResponseHelper.toBaseResponse(result))

    } catch(e) {
        next(e);
    }

}

rosterController.deleteRosterById = async (req, res, next) => {

    const { rosterId } = req.params;
    const user = req.user;

    if (user.functions.indexOf('D9') === -1)
        return res.status(403).json(ResponseHelper.toErrorResponse(403))

    try {

        const result = await rosterService.deleteRosterById(rosterId);

        if (!result)
            return res.status(400).json(ResponseHelper.toErrorResponse(400))
        return res.status(200).json(ResponseHelper.toBaseResponse(result))

    } catch(e) {
        next(e);
    }

}

rosterController.getAllRostersByTimesheetId = async (req, res, next) => {

    const { timesheetId } = req.params
    const user = req.user;

    if (user.functions.indexOf('R9') === -1)
        return res.status(403).json(ResponseHelper.toErrorResponse(403))

    try {

        const rosterList = await rosterService.getAllRosters(timesheetId);

        if(!rosterList)
            return res.status(403).json(ResponseHelper.toErrorResponse(403))
        return res.status(200).json(ResponseHelper.toBaseResponse(rosterList))
        
    } catch (e) {
        next(e);
    }
}

rosterController.getAllMemberById = async (req, res, next) => {

    const { page, size } = req.query
    const { rosterId } = req.params;
    const user = req.user;

    if (user.functions.indexOf('R9') === -1)
        return res.status(403).json(ResponseHelper.toErrorResponse(403))

    try {

        const pageObj = await rosterService.getAllMemberById(parseInt(page), parseInt(size), rosterId);

        if(!pageObj)
            return res.status(400).json(ResponseHelper.toErrorResponse(400))
        return res.status(200).json(ResponseHelper.toBaseResponse(pageObj.data, pageObj.paging))
        
    } catch (e) {
        next(e);
    }
}

rosterController.updateRosterById = async (req, res, next) => {

    const { rosterId } = req.params
    const user = req.user;
    const { name, description, departmentId } = req.body;

    if (user.functions.indexOf('U9') === -1)
        return res.status(403).json(ResponseHelper.toErrorResponse(403))

    try {

        const rosterDTO = { 
            erostername: name,
            erosterdescription: description,
            edepartmentedepartmentid: departmentId
        }

        const result = await rosterService.updateRosterById(parseInt(rosterId), rosterDTO, user);

        if (!result)
            return res.status(400).json(ResponseHelper.toErrorResponse(400))
        return res.status(200).json(ResponseHelper.toBaseResponse(result))
        
    } catch (e) {
        next(e);
    }
}

rosterController.viewRosterById = async (req, res, next) => {
    
    const { rosterId } = req.params;
    const user = req.user;

    if (user.functions.indexOf('R9') === -1)
        return res.status(403).json(ResponseHelper.toErrorResponse(403))

    try {

        const result = await rosterService.viewRosterById(rosterId);

        if (!result)
            return res.status(400).json(ResponseHelper.toErrorResponse(400))
        return res.status(200).json(ResponseHelper.toBaseResponse(result))

    } catch(e) {
        next(e);
    }

}

rosterController.updateUsersOfRosters = async (req, res, next) => {

    const { rosters, projectId } = req.body

    if (req.user.functions.indexOf('U9') === -1)
        return res.status(403).json(ResponseHelper.toErrorResponse(403))

    try {
        const result = await rosterService.updateUsersOfRosters(projectId, rosters, req.user)
        return res.status(200).json(ResponseHelper.toBaseResponse(result))
    } catch (e) {
        next(e)
    }
}

rosterController.assignRosterToShiftTimeByTimesheetId = async (req, res, next) => {

    const { timesheetId } =req.params

    const { mappings } = req.body

    if (req.user.functions.indexOf('C9') === -1)
        return res.status(403).json(ResponseHelper.toErrorResponse(403))

    try {
        const result = await rosterService.assignRosterToShiftTime(timesheetId, mappings, req.user)
        if (!result) return res.status(400).json(ResponseHelper.toErrorResponse(400))
        return res.status(200).json(ResponseHelper.toBaseResponse(result))
    } catch (e) {
        next(e)
    }

}


module.exports = rosterController
