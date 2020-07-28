const RosterService = require('../../services/rosterService');

module.exports = async (req, res, next) => {

    try {

        const user = req.user;

        if (user.permission !== 8) {
            return res.status(401).json({
                data: 'You cannot see rosters'
            })
        }

        const rosters = await RosterService.getAllRosters();

        return res.status(200).json({
            data: rosters
        });
        
    } catch (e) {
        next(e);
    }
}