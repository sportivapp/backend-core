const RosterService = require('../../services/rosterService');

module.exports = async (req, res, next) => {

    try {

        const user = req.user;
        const rosterId = req.body.rosterId;

        if (user.permission !== 8) {
            return res.status(401).json({
                data: 'You cannot see roster members'
            })
        }

        const members = await RosterService.getAllMemberById( rosterId );

        return res.status(200).json({
            data: members
        });
        
    } catch (e) {
        next(e);
    }
}