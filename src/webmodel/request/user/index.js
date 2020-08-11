const { routes } = require('../../../constant')
const UserLoginRequest = require('./UserLoginRequest')
const ForgotPasswordRequest = require('./ForgotPasswordRequest')
const CreateUserRequest = require('./CreateUserRequest')
const ChangePasswordRequest = require('./ChangePasswordRequest')

const userSchemas = {}

userSchemas[routes.user.login] = UserLoginRequest
userSchemas[routes.user.forgot] = ForgotPasswordRequest
userSchemas[routes.user.create] = CreateUserRequest
userSchemas[routes.user.password] = ChangePasswordRequest

module.exports = userSchemas