const { routes } = require('../../../constant')
const CreateDeviceRequest = require('./CreateDeviceRequest')
const UpdateDeviceRequest = require('./UpdateDeviceRequest')
const SaveProjectIntoDeviceRequest = require('./SaveProjectIntoDeviceRequest')

const deviceSchemas = {}

deviceSchemas[routes.device.device] = CreateDeviceRequest
deviceSchemas[routes.device.deviceId] = UpdateDeviceRequest
deviceSchemas[routes.device.deviceProjectId] = SaveProjectIntoDeviceRequest

module.exports = deviceSchemas