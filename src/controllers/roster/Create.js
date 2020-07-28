const rosterService = require('../../services/rosterService');

module.exports = async (req, res, next) => {

    try {

        const { rosterName, rosterDescription, projectId, supervisorId, headUserId , userIds} = req.body;
        const user = req.user;

        if (user.permission !== 8) {
            return res.status(401).json({
                data: 'You cannot create roster'
            })
        }

        const rosterDTO = { 
            erostername: rosterName, 
            erosterdescription: rosterDescription,
            eprojecteprojectid: projectId,
            erostersupervisoruserid: supervisorId, 
            erosterheaduserid: headUserId, 
            erostercreateby: user.sub
        }

        const roster = await rosterService.createRoster(rosterDTO, userIds);

        return res.status(200).json({
            data: roster
        });

    } catch(e) {
        next(e);
    }

}