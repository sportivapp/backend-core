const rosterService = require('../../services/rosterService');
const ResponseHelper = require('../../helper/ResponseHelper')

module.exports = async (req, res, next) => {
    
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