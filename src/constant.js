const v2 = '/api/v2';

module.exports = {
    routes: {
        base: '/api/v1',
        company: {
            list: '/company',
            myList: '/my-company',
            register: '/company-register',
            id: '/company/:companyId',
            users: '/company/:companyId/users',
            exit: '/company-exit',
            cancelJoin: '/company-cancel-join',
            processInvitation: '/company-process-invitation'
        },
        user: {
            login: '/user-login',
            forgot: '/user-forgot-password',
            create: '/user-create',
            list: '/user',
            update: '/user',
            byCompany: '/user/company/:companyId',
            import: '/user-import-template',
            id: '/user/:userId',
            approval: '/user/approval',
            coach: '/user/coach',
            removeCoach: '/user/coach-remove',
            industry: '/user/industry',
            pending: '/user-pending-log',
            profile: '/user-profile',
            selfProfile: '/user-self-profile',
            changePassword: '/user-change-password',
            searchByName: '/user-search-name',
        },
        profile: {
            changeCompany: '/change-company',
            currentCompany: '/current-company',
            changePassword: '/change-password',
            profile: '/profile',
            modules: '/profile/modules',
            moduleFunctions: '/profile/modules/:moduleId/functions',
            functions: '/profile/functions'
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
            publish: '/publish-announcement/:announcementId',
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
        tournament: {
            companies: '/tournament/companies'
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
        city: {
            list: '/city'
        },
        experience: {
            list: '/experience',
            id: '/experience/:experienceId'
        },
        team: {
            list: '/team',
            id: '/team/:teamId',
            members: '/team/:teamId/members',
            teamLog: '/team/:teamId/log',
            kick: '/team-kick',
            invite: '/team-invite',
            processInvitation: '/team-process-invitation',
            processRequest: '/team-process-request',
            join: '/team-join',
            position: '/team-member-position',
            roles: '/team-member-roles',
            cancelInvitation: '/team-cancel-invite',
            cancelRequest: '/team-cancel-request',
            exit: '/team-exit',
            myTeam: '/team-user',
            isAdmin: '/team/:teamId/admin',
            userPendingLog: '/team-user-pending'
        },
        class: {
            list: '/class',
            id: '/class/:classId',
            classUser: '/class/:classId/users',
            pendingUser: '/class/:classId/pending-users',
            processRegistration: '/class/:classId/process-registration'
        },
        classUser: {
            registration: '/user-class/registration',
            list: '/user-class',
            id: '/user-class/:classUserId',
            history: '/user-class-history',
            historyId: '/user-class-history/:classUserId'
        },
        classV2: {
            list: '/class-v2',
            id: '/class-v2/:classUuid',
            idCategory: '/class-v2/:classUuid/class-category/:classCategoryUuid',
            listCategory: '/class-v2/:classUuid/class-category',
            reschedule: '/class-v2/:classUuid/class-category/:classCategoryUuid/class-category-session/:classCategorySessionUuid/reschedule',
            register: '/class-v2/:classUuid/class-category/:classCategoryUuid/register',
            participants: '/class-v2/:classUuid/participants',
            myClass: '/my-class-v2',
            coachClass: '/coach-class-v2',
            coaches: '/class-v2/:classUuid/coaches',
        },
        classCategorySession: {
            list: '/class-category/:classCategoryUuid/class-category-session',
            id: '/class-category/:classCategoryUuid/class-category-session/:classCategorySessionUuid',
            participants: '/class-category/:classCategoryUuid/class-category-session/:classCategorySessionUuid/participants',
            absence: '/class-category/:classCategoryUuid/class-category-session/:classCategorySessionUuid/absence',
        },
        classCategory: {
            list: '/category',
            id: '/category/:classCategoryUuid',
            idCoach: '/coach-category/:classCategoryUuid',
            startSession: '/coach-category/:classCategoryUuid/class-category-session/:classCategorySessionUuid/start',
            endSession: '/coach-category/:classCategoryUuid/class-category-session/:classCategorySessionUuid/end',
            participants: '/class-category/:classCategoryUuid/participants',
            myCategory: '/my-class-category/:classCategoryUuid',
            extend: '/class-category/:classCategoryUuid/extend',
            reschedule: '/coach-category/:classCategoryUuid/class-category-session/:classCategorySessionUuid/reschedule',
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
            id: '/company/:companyId/log/:companyLogId',
            listPending: '/company-user-pending',
            cancelInvite: '/company-cancel-invite',
            processRequest: '/company-process-request'

        },
        app: {
            version: '/app/version'
        },
        news: {
            list: '/news',
            id: '/news/:newsId',
            publish: '/news/:newsId/publish',
            count: '/news/:newsId/count',
            generate: '/news/:newsId/link',
            like: '/news/:newsId/like',
        },
        newsUser: {
            list: '/user-news',
            id: '/user-news/:newsId',
            like: '/user-news/:newsId/like',
            count: '/user-news/:newsId/count',
            generate: '/user-news/:newsId/link'
        },
        notification: {
            list: '/notification',
            internalList: '/internal/notification',
            count: '/notification/count',
            click: '/notification/:notificationId/click',
        },
        license: {
            id : '/license/:licenseId'
        },
        file: {
            download: '/file-download/:fileId'
        },
        theory: {
            list: '/theory',
            download: '/theory/:theoryId/download',
            preview: '/theory/:theoryId/preview',
            remove: '/theory/:theoryId/delete'
        },
        comment: {
            threadComments: '/thread/:threadId/comments',
            list: '/comment',
            id: '/comment/:commentId',
            threadPostId: '/thread/:threadId/comments/:commentId',
            idThread: '/comment/:commentId/thread',
        },
        thread: {
            list: '/thread',
            id: '/thread/:threadId',
            moderator: '/thread/:threadId/moderator-status'
        },
        authentication: {
            login: '/login',
            logout: '/logout',
            loginCompany: '/login-company',
            loginAuto: '/login-auto'
        },
        sportTypeRole: {
            industry: '/sport-type-role/industry/:industryId'
        },
        commentReply: {
            list: '/comments/:commentId/replies',
            id: '/comments/:commentId/replies/:replyId',
            idThread: '/replies/:replyId/thread',
        },
        report: {
            thread: '/report/thread',
            threadType: '/report/thread/type'
        },
        steam: {
            redirect: '/auth/steam',
            authenticate: '/auth/steam/authenticate',
        },
        banner: {
            list: '/banner',
        },
        permissionV2: {
            moduleName: '/permissions/:moduleName'
        },
        verifyV2: {
            token: '/verify/token'
        }
    }
}