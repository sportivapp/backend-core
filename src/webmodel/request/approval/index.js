const { routes } = require('../../../constant')
const CreateApprovalRequest = require('./CreateApprovalRequest')
const UpdateApprovalRequest = require('./UpdateApprovalRequest')
const AddUserToApprovalRequest = require('./AddUserToApprovalRequest')

const approvalSchemas = {}

approvalSchemas[routes.approval.list] = CreateApprovalRequest
approvalSchemas[routes.approval.find] = UpdateApprovalRequest
approvalSchemas[routes.approval.id] = AddUserToApprovalRequest

module.exports = approvalSchemas