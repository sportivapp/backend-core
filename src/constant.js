module.exports = {
    routes: {
        base: '/api/v1',
        company: {
            list: '/company',
            register: '/company-register',
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
            id: '/user/:userId',
            approval: '/user/approval',
            changeCompany: '/user/change-company'
        },
        grade: {
            list: '/grades',
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
        },
        device: {
            list: '/devices',
            deviceId: '/devices/:deviceId',
            deviceProjectId: '/devices/:deviceId/projects'
        },
        roster: {
            list: '/roster',
            rosterId: '/roster/:rosterId',
            shift: '/roster-shift',
            rosterMemberId: '/roster-members/:rosterId'
        }
    }
}