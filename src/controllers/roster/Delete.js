const rosterService = require('../../services/rosterService');

module.exports = async (req, res, next) => {

    try {

        const rosterId = req.body.rosterId;
        const user = req.user;

        if (user.permission !== 8) {
            return res.status(401).json({
                data: 'You cannot Delete roster'
            })
        }

        const isDeleted = await rosterService.deleteRosterById(rosterId);

        const data = {
            isDeleted: (isDeleted) ? true : false,
            message: (isDeleted) ? "Successfully delete roster!" : "Failed to delete roster!"
        }

        return res.status(200).json({
            data: data
        });

    } catch(e) {
        next(e);
    }

}