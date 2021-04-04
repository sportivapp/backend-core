const { routes } = require('../../../constant')
const UserLoginRequest = require('./UserLoginRequest')
const ForgotPasswordRequest = require('./ForgotPasswordRequest')
const CreateUserRequest = require('./CreateUserRequest')
const UpdateUserRequest = require('./UpdateUserRequest')
const ChangePasswordRequest = require('./ChangePasswordRequest')
const AddApprovalUserRequest = require('./AddApprovalUserRequest')
const UpdateUserCoachRequest = require('./UpdateUserCoachRequest')

const userSchemas = {}

userSchemas[routes.user.login] = UserLoginRequest
userSchemas[routes.user.forgot] = ForgotPasswordRequest
userSchemas[routes.user.list] = CreateUserRequest
userSchemas[routes.user.password] = ChangePasswordRequest
// userSchemas[routes.user.update] = UpdateUserRequest
userSchemas[routes.user.approval] = AddApprovalUserRequest
userSchemas[routes.user.coach] = UpdateUserCoachRequest

module.exports = userSchemas