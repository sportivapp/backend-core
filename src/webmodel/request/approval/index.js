const { routes } = require('../../../constant')
const CreateApprovalRequest = require('./CreateApprovalRequest')
const UpdateApprovalRequest = require('./UpdateApprovalRequest')

const approvalSchemas = {}

approvalSchemas[routes.approval.list] = CreateApprovalRequest
approvalSchemas[routes.approval.find] = UpdateApprovalRequest

module.exports = approvalSchemas