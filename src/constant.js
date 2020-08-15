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
            register: '/user',
            forgot: '/user-forgot-password',
            create: '/user-create',
            password: '/user-change-password',
            list: '/user/:companyId',
            import: '/user-import-template',
            remove: '/user/:userId',
            changeCompany: '/user/change-company'
        },
        grade: {
            grades: '/grades',
            id: '/grades/:gradeId',
            mapping: '/grades-user-mapping'
        },
        absen: {
            create: '/absen',
            listId: '/absen-list/:userId',
            list: '/absen-list',
            update: '/absen/:absenId',
            remove: '/absen-delete/:absenId'
        },
        announcement: {
            create: '/announcement',
            id: '/announcement/:announcementId',
            list: '/announcement-list'
        },
        department: {
            list: '/department',
            id: '/department/:departmentId'
        }
    }
}