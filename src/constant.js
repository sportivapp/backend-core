module.exports = {
    routes: {
        base: '/api/v1',
        company: {
            list: '/company',
            register: '/company-register',
            id: '/company/:companyId',
            users: '/company/:companyId/users',
            exit: '/company-exit',
            cancelJoin: '/company-cancel-join/:companyId',
            processInvitation: '/company-process-invitation'
        },
        user: {
            login: '/user-login',
            register: '/user',
            forgot: '/user-forgot-password',
            create: '/user-create',
            list: '/user/company/:companyId',
            import: '/user-import-template',
            id: '/user/:userId',
            approval: '/user/approval',
            coach: '/user/coach',
            removeCoach: '/user/coach-remove',
            industry: '/user/industry',
            pending: '/user-pending-log',
            profile: '/user-profile'
        },
        profile: {
            changeCompany: '/change-company',
            currentCompany: '/current-company',
            changePassword: '/change-password',
            profile: '/profile',
            modules: '/profile/modules',
            functions: '/profile/modules/:moduleId/functions'
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
        approval: {
            find: '/approval/find',
            list: '/approval',
            id: '/approval/:approvalId',
            user: '/approval/:approvalId/user/:userId'
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
            list: '/industry',
            licenseLevel: '/industry-license-level'
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
        team: {
            list: '/team',
            id: '/team/:teamId',
            member: '/team-member',
            kick: '/team-kick',
            invite: '/team-invite',
            processInvitation: '/team-process-invitation',
            processRequest: '/team-process-request',
            join: '/team-join',
            position: '/team-member-position',
            cancelInvitation: '/team-cancel-invite',
            cancelRequest: '/team-cancel-request',
            exit: '/team-exit',
        },
        class: {
            list: '/class',
            id: '/class/:classId',
            classUser: '/class/:classId/users',
            pendingUser: '/class/:classId/pending-users',
            processRegistration: '/class/process-registration'
        },
        classUser: {
            registration: '/user-class/registration',
            list: '/user-class',
            id: '/user-class/:classUserId',
            history: '/user-class-history',
            historyId: '/user-class-history/:classUserId'
        },
        permit: {
            list: '/permit',
            id: '/permit/:permitId',
            action: '/permit/action',
            request: '/permit/:permitId/request',
            subordinate: '/permit/subordinate'
        },
        companyLog: {
            list: '/company/:companyId/log',
            id: '/company/:companyId/log/:companyLogId'
        },
        app: {
            version: '/app/version'
        },
        news: {
            id: '/news/:newsId'
        },
        notification: {
            list: '/notification'
        },
        license: {
            id : '/license/:licenseId'
        },
        file: {
            download: '/file-download/:fileId'
        },
        theory: {
            list: '/theory',
            download: '/theory/:fileId/download',
            preview: '/theory/:fileId/preview',
            remove: '/theory/:fileId/delete'
        }
    }
}