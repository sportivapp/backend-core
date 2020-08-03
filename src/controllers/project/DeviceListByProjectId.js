const projectService = require('../../services/projectService')
const ResponseHelper = require('../../helper/ResponseHelper')

module.exports = async (req, res, next) => {

    try {
        const { page, size } = req.query

        const { projectId } = req.params

        const pageObj = await projectService.getDevicesByProjectId(projectId, page, size)

        return res.status(200).json(ResponseHelper.toPageResponse(pageObj.data, pageObj.paging))
    } catch(e) {
        next(e)
    }

}