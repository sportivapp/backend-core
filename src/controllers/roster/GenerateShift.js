const rosterService = require('../../services/rosterService');

module.exports = async (req, res, next) => {

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
        console.log(e.stack);
        next(e);
    }

}