const deviceService = require('../../services/deviceService')
const ResponseHelper = require('../../helper/ResponseHelper')

const controller = {}

function isUserValid(user) {
    return user.permission === 10 || user.permission === 9
}

controller.getDevices = async (req, res, next) => {

    const { page, size } = req.query

    try {
        const pageObj = await deviceService.getDevices(parseInt(page), parseInt(size))
        return res.status(200).json(ResponseHelper.toPageResponse(pageObj.data, pageObj.paging))
    } catch (e) {
        next(e)
    }

}

controller.getDeviceById = async (req, res, next) => {

    const { deviceId } = req.params

    try {
        const device = await deviceService.getDeviceById(deviceId)
        if (!device)
            return res.status(404).json(ResponseHelper.toErrorResponse(404))
        return res.status(200).json(ResponseHelper.toBaseResponse(device))
    } catch (e) {
        next(e)
    }
}

controller.createDevice = async (req, res, next) => {

    if(!isUserValid(req.user))
        return res.status(403).json(ResponseHelper.toErrorResponse(403))

    const { info, imei } = req.body

    const deviceDTO = {
        edeviceidinfo: info,
        edeviceimei: imei,
        edevicecreateby: req.user.sub
    }

    try {

        const device = await deviceService.createDevice(deviceDTO)
        if (!device)
            return res.status(400).json(ResponseHelper.toErrorResponse(400))
        return res.status(200).json(ResponseHelper.toBaseResponse(device))
    } catch (e) {
        next(e)
    }
}

controller.updateDevice = async (req, res, next) => {

    if(!isUserValid(req.user))
        return res.status(403).json(ResponseHelper.toErrorResponse(403))

    const { info, imei } = req.body

    const { deviceId } = req.params

    const deviceDTO = {
        edeviceidinfo: info,
        edeviceimei: imei
    }

    try {
        const updatedDevice = await deviceService.updateDevice(deviceId, deviceDTO)
        if (!updatedDevice)
            return res.status(400).json(ResponseHelper.toErrorResponse(400))
        return res.status(200).json(ResponseHelper.toBaseResponse(updatedDevice))
    } catch (e) {
        next(e)
    }
}

controller.deleteDevice = async (req, res, next) => {

    if(!isUserValid(req.user))
        return res.status(403).json(ResponseHelper.toErrorResponse(403))

    const { deviceId } = req.params

    try {
        const result = await deviceService.deleteDevice(deviceId)
        return res.status(200).json(ResponseHelper.toBaseResponse(result))
    } catch (e) {
        next(e)
    }
}

controller.getProjectsByDeviceId = async (req, res, next) => {

    const { page, size } = req.query

    const { deviceId } = req.params

    try {
        const pageObj = await deviceService.getProjectsByDeviceId(deviceId, parseInt(page), parseInt(size))
        return res.status(200).json(ResponseHelper.toPageResponse(pageObj.data, pageObj.paging))
    } catch (e) {
        next(e)
    }
}

controller.saveProjectsIntoDevice = async (req, res, next) => {

    if(!isUserValid(req.user))
        return res.status(403).json(ResponseHelper.toErrorResponse(403))

    const { projectIds } = req.body

    const { deviceId } = req.params

    const user = req.user

    try {
        const savedIds = await deviceService.saveProjectsIntoDevice(deviceId, projectIds, user)
        if (savedIds.length != projectIds.length)
            return res.status(400).json(ResponseHelper.toErrorResponse(400))
        return res.status(200).json(ResponseHelper.toBaseResponse(savedIds))
    } catch (e) {
        console.log(e)
        next(e)
    }
}

module.exports = controller