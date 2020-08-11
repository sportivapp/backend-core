module.exports = {
    routes: {
        base: '/api/v1',
        company: {
            list: '/company',
            id: '/company/:companyId',
            users: '/company/:companyId/users'
        },
        user: {
            login: '/user-login',
            forgot: '/user-forgot-password',
            create: '/user-create',
            password: '/user-change-password'
        }
    }
}