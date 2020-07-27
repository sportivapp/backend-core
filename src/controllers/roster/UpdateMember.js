const RosterService = require('../../services/rosterService');

module.exports = async (req, res, next) => {

    try {

        const user = req.user;
        const { rosterId, userIds } = req.body;

        if (user.permission !== 8) {
            return res.status(401).json({
                data: 'You cannot update roster'
            })
        }

        // return 1 for true , 0 for false
        const updateMember = await RosterService.updateMemberByRosterId( rosterId, userIds );

        return res.status(200).json({
            data: updateMember
        });
        
    } catch (e) {
        next(e);
    }
}