const { routes } = require('../../../constant')
const CreateClassRequest = require('./CreateClassRequest')

const classSchemas = {}

const LANDING_BASE_URL = '/landing';

classSchemas[LANDING_BASE_URL + routes.classV2.list] = CreateClassRequest

module.exports = classSchemas;