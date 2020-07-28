const rosterService = require('../../services/rosterService');

module.exports = async (req, res, next) => {

    try {

        const rosterId = req.body.rosterId;
        const user = req.user;

        if (user.permission !== 8) {
            return res.status(401).json({
                data: 'You cannot View roster'
            })
        }

        const roster = await rosterService.viewRosterById(rosterId);

        return res.status(200).json({
            data: roster
        });

    } catch(e) {
        next(e);
    }

}