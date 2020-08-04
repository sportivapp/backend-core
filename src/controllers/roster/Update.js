const RosterService = require('../../services/rosterService');
const ResponseHelper = require('../../helper/ResponseHelper')

module.exports = async (req, res, next) => {

    const { rosterId } = req.params
    const user = req.user;
    const { rosterName, rosterDescription , projectId, supervisorId, headUserId, userIds } = req.body;

    try {

        const rosterDTO = { 
            erostername: rosterName, 
            erosterdescription: rosterDescription,
            eprojecteprojectid: projectId,
            erostersupervisoruserid: supervisorId, 
            erosterheaduserid: headUserId
        }

        const result = await RosterService.updateRosterById( parseInt(rosterId) , rosterDTO, userIds , user);

        if (!result)
            return res.status(400).json(ResponseHelper.toErrorResponse(400))
        return res.status(200).json(ResponseHelper.toBaseResponse(result))
        
    } catch (e) {
        next(e);
    }
}