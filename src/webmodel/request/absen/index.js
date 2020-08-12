const { routes } = require('../../../constant')
const CreateAbsenRequest = require('./CreateAbsenRequest')
const EditAbsenRequest = require('./EditAbsenRequest')

const absenSchemas = {}

absenSchemas[routes.absen.create] = CreateAbsenRequest
absenSchemas[routes.absen.update] = EditAbsenRequest

module.exports = absenSchemas