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
            list: '/user/company/:companyId',
            import: '/user-import-template',
            id: '/user/:userId',
            approval: '/user/approval',
            changeCompany: '/user/change-company',
            currentCompany: '/user/current-company',
            coach: '/user/coach'
        },
        grade: {
            list: '/grades',
            id: '/grades/:gradeId',
            mapping: '/grades-user-mapping',
            users: '/grades/:gradeId/users'
        },
        absen: {
            list: '/absen',
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
            id: '/department/:departmentId',
            users: '/department/:departmentId/users'
        },
        device: {
            list: '/devices',
            deviceId: '/devices/:deviceId',
            deviceProjectId: '/devices/:deviceId/projects'
        },
        project: {
            list: '/project',
            id: '/project/:projectId',
            timesheet: '/project/:projectId/timesheet'
        },
        timesheet: {
            list: '/timesheet',
            id: '/timesheet/:timesheetId',
            assign: '/timesheet/:timesheetId/assign'
        },
        todolist: {
            list: '/todolist',
            id: '/todolist/:todoId',
            category: '/todolist/todo/category'
        },
        roster: {
            list: '/timesheet/:timesheetId/roster',
            members: '/timesheet/:timesheetId/roster-member',
            rosterId: '/timesheet/:timesheetId/roster/:rosterId',
            shift: '/timesheet/:timesheetId/roster-shift',
            rosterMemberId: '/timesheet/:timesheetId//roster/:rosterId/members',
            memberAssign: '/timesheet/:timesheetId/roster-assign',
        },
        shift: {
            list: '/shift',
            id: '/shift/:shiftId'
        },
        shiftPattern: {
            list: '/shift/:shiftId/pattern',
            id: '/shift/:shiftId/pattern/:patternId'
        },
        industry: {
            list: '/industry'
        },
        state: {
            list: '/state'
        },
        country: {
            list: '/country'
        },
        experience: {
            list: '/experience',
            id: '/experience/:experienceId'
        },
        coach: {
            list: '/coach'
        }
    }
}