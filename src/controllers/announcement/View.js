const announcementService = require('../../services/announcementService');

module.exports = async (req, res, next) => {

    try {

        const { announcementId } = req.params;
        const user = req.user;

        if (user.permission !== 1 && user.permission !== 7) {
            return res.status(401).json({
                data: 'You cannot get announcement by id'
            })
        }

        const announcement = await announcementService.getAnnouncementById(announcementId);

        return res.status(200).json({
            data: announcement
        });
        
    } catch (e) {
        next(e);
    }
}