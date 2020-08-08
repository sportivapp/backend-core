module.exports = {
    routes: {
        base: '/api/v1',
        company: {
            list: '/company',
            id: '/company/:companyId',
            users: '/company/:companyId/users'
        }
    }
}