const projectService = require('../../services/projectService')
const ResponseHelper = require('../../helper/ResponseHelper')

module.exports = async (req, res, next) => {

    try {
        const { deviceIds } = req.body

        const { projectId } = req.params

        const user = req.user

        if (user.permission !== 10 && user.permission !== 9)
            return res.status(403).json(ResponseHelper.toErrorResponse(403))

        const deviceList = await projectService.saveDevicesIntoProject(projectId, deviceIds, user)

        return res.status(200).json(ResponseHelper.toBaseResponse(deviceList))
    } catch(e) {
        next(e)
    }

}