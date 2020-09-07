const rosterService = require('../../services/rosterService')
const ResponseHelper = require('../../helper/ResponseHelper')

rosterController = {}

rosterController.createRoster = async (req, res, next) => {
    
    const { rosterName, rosterDescription, projectId, supervisorId, headUserId , userIds} = req.body;
    const user = req.user;

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

    try {

        const result = await rosterService.deleteRosterById(rosterId, user);

        if (!result)
            return res.status(400).json(ResponseHelper.toErrorResponse(400))
        return res.status(200).json(ResponseHelper.toBaseResponse(result))

    } catch(e) {
        next(e);
    }

}

rosterController.generateRosterShiftForDate = async (req, res, next) => {

    try {

        const user = req.user;

        if (user.permission !== 8) {
            return res.status(401).json({
                data: 'You cannot generate roster shifts'
            })
        }

        const { hourType, formation, rosterId, date } = req.body;

        const roster = await rosterService.generateRosterShiftForDate(hourType, formation, rosterId, date);

        return res.status(200).json({
            data: roster
        });

    } catch(e) {
        next(e);
    }

}

rosterController.getAllRostersByTimesheetId = async (req, res, next) => {

    const { timesheetId } = req.params
    const user = req.user;

    try {

        const rosterList = await rosterService.getAllRosters(timesheetId, user);

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

    try {

        const pageObj = await rosterService.getAllMemberById(parseInt(page), parseInt(size), rosterId, user);

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

    try {

        const result = await rosterService.viewRosterById(rosterId, user);

        if (!result)
            return res.status(400).json(ResponseHelper.toErrorResponse(400))
        return res.status(200).json(ResponseHelper.toBaseResponse(result))

    } catch(e) {
        next(e);
    }

}

rosterController.updateUsersOfRosters = async (req, res, next) => {

    const { rosters, projectId } = req.body

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

    try {
        const result = await rosterService.assignRosterToShiftTime(timesheetId, mappings, req.user)
        if (!result) return res.status(400).json(ResponseHelper.toErrorResponse(400))
        return res.status(200).json(ResponseHelper.toBaseResponse(result))
    } catch (e) {
        next(e)
    }

}


module.exports = rosterController
