const RosterService = require('../../services/rosterService');
const ResponseHelper = require('../../helper/ResponseHelper')

module.exports = async (req, res, next) => {

    const { page, size } = req.query
    const { rosterId } = req.params;
    const user = req.user;

    try {

        const pageObj = await RosterService.getAllMemberById(parseInt(page), parseInt(size), rosterId, user);

        if(!pageObj)
            return res.status(400).json(ResponseHelper.toErrorResponse(400))
        return res.status(200).json(ResponseHelper.toBaseResponse(pageObj.data, pageObj.paging))
        
    } catch (e) {
        next(e);
    }
}