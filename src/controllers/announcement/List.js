const announcementService = require('../../services/announcementService');

module.exports = async (req, res, next) => {

    try {

        const user = req.user;

        if (user.permission !== 1 && user.permission !== 7) {
            return res.status(401).json({
                data: 'You cannot get all announcement'
            })
        }

        const announcement = await announcementService.getAllAnnouncement();

        return res.status(200).json({
            data: announcement
        });
        
    } catch (e) {
        next(e);
    }
}