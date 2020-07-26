const RosterService = require('../../services/rosterService');

module.exports = async (req, res, next) => {

    try {

        const user = req.user;
        const { rosterId, rosterName, rosterDescription , projectId, supervisorId, headUserId, userIds } = req.body;

        if (user.permission !== 8) {
            return res.status(401).json({
                data: 'You cannot update roster'
            })
        }

        const rosterDTO = { 
            erostername: rosterName, 
            erosterdescription: rosterDescription,
            eprojecteprojectid: projectId,
            erostersupervisoruserid: supervisorId, 
            erosterheaduserid: headUserId
        }

        // return 1 for true , 0 for false
        const updateRoster = await RosterService.updateRosterById( rosterId, rosterDTO, userIds );

        const data = {
            isUpdated: (updateRoster) ? true : false,
            message: (updateRoster) ? "Roster Successfully Change!" : "Failed to Change Roster!"
        }

        return res.status(200).json({
            data: data
        });
        
    } catch (e) {
        console.log(e);
        next(e);
    }
}