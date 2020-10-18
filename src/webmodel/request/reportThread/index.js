const { routes } = require('../../../constant')
const ReportThreadRequest = require('./ReportThreadRequest')

const reportThreadSchemas = {}

reportThreadSchemas[routes.report.thread] = ReportThreadRequest

module.exports = reportThreadSchemas