const ProjectDeviceMapping = require('../models/ProjectDeviceMapping')
const Device = require('../models/Device')
const ServiceHelper = require('../helper/ServiceHelper')

const deviceService = {}

deviceService.getDevices = async (page, size) => {

    const devicePage = await Device.query()
        .page(page, size)
    console.log(devicePage)
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
    console.log(affectedRow)
    return affectedRow === 1
}

deviceService.getProjectsByDeviceId = async (deviceId, page, size) => {

    const projectPage = await ProjectDeviceMapping.query()
        .where('edevicedeviceid', parseInt(deviceId))
        .page(page, size)
    console.log(projectPage.results)
    return ServiceHelper.toPageObj(page, size, projectPage)
}

deviceService.saveProjectsIntoDevice = async (deviceId, projectIds) => {

    const existedRelations = await ProjectDeviceMapping.query()
    .where('edevicedeviceid', deviceId)

    let sameRelations = []

    const projects = projectIds
        .map(projectId => ({
            eprojectprojectid: projectId,
            edevicedeviceid: parseInt(deviceId)}))
        .filter(project => {

            let existed = existedRelations.indexOf(project)

            //if project relation already exist in DB, push to sameRelations array
            if(existed >= 0) {
                sameRelations.push(project)
                return false
            }
            return true
    })

    //search for project relations to be deleted
    const removedProjects = existedRelations
        .filter(relation => sameRelations.indexOf(relation) === -1)
        .map(relation => relation.eprojectprojectid)

    await ProjectDeviceMapping.query().delete()
        .where('edevicedeviceid', deviceId)
        .whereIn('eprojectprojectid', removedProjects)

    if(projects.length > 0)
        return ProjectDeviceMapping.query().insert(projects)
    else
        return sameRelations
}

module.exports = deviceService