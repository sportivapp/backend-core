const myForumService = require('../../services/myForumService')
const ResponseHelper = require('../../helper/ResponseHelper')

const controller = {}

controller.getMyThreadList = async (req, res, next) => {

    const { page = '0', size = '10', keyword = ''} = req.query;

    try {

        const pageObj = await myForumService.getMyThreadList(parseInt(page), parseInt(size), keyword.toLowerCase(), req.user);
        return res.status(200).json(ResponseHelper.toPageResponse(pageObj.data, pageObj.paging))

    } catch(e) {
        next(e);
    }

}

module.exports = controller