const ProjectDeviceMapping = require('../models/ProjectDeviceMapping')
const Device = require('../models/Device')
const ServiceHelper = require('../helper/ServiceHelper')

const deviceService = {}

deviceService.getDevices = async (page, size) => {

    const devicePage = await Device.query()
        .page(page, size)
    return ServiceHelper.toPageObj(page, size, devicePage)
}

deviceService.getDeviceById = async (deviceId) => {

    return Device.query()
        .where('edeviceid', deviceId)
        .first()
}

deviceService.createDevice = async (deviceDTO) => {

    return Device.query().insert(deviceDTO)
}

deviceService.updateDevice = async (deviceId, deviceDTO) => {

    const device = await deviceService.getDeviceById(deviceId)

    if (!device)
        return
    else
        return device.$query().patchAndFetch(deviceDTO)
}

deviceService.deleteDevice = async (deviceId) => {

    await ProjectDeviceMapping.query().delete().where('edevicedeviceid', deviceId)
    const affectedRow = await Device.query().deleteById(deviceId)
    return affectedRow === 1
}

deviceService.getProjectsByDeviceId = async (deviceId, page, size) => {

    const projectPage = await ProjectDeviceMapping.query()
        .where('edevicedeviceid', parseInt(deviceId))
        .page(page, size)
    return ServiceHelper.toPageObj(page, size, projectPage)
}

deviceService.saveProjectsIntoDevice = async (deviceId, projectIds) => {

    const projects = projectIds
        .map(projectId => ({
            eprojectprojectid: projectId,
            edevicedeviceid: parseInt(deviceId)}))


    await ProjectDeviceMapping.query().delete()
        .where('edevicedeviceid', deviceId)

    return ProjectDeviceMapping.query().insert(projects)
}

module.exports = deviceService