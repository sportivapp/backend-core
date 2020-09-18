const NotificationEnum = {
    company: {
        type: 'COMPANY',
        actions: {

        }
    },
    class: {
        type: 'CLASS',
        actions: {
            join: {
                register: {
                    title: 'Register Class',
                    code: 'REGISTER_CLASS',
                    message: 'You have been Enrolled for this class'
                },
                Approved: {
                    title: 'Approved Class',
                    code: 'APPROVED_CLASS',
                    message: 'Class you registered has been Approved'
                },
                rejected: {
                    title: 'Rejected Class',
                    code: 'REJECTED_CLASS',
                    message:'Class your registered has been rejected'
                }
            }
        }

    },
    user: {
        type: 'USER',
        actions: {
            join: {
                title: 'User Apply',
                code: 'USER_APPLY',
                message: 'New user has applied to Organization!'
            },
            exit: {
                title: 'User Exit',
                code: 'USER_EXIT',
                message: 'a user leave from your Organization!'
            },
            accepted: {
                title: 'User Join',
                code: 'USER_JOIN',
                message: 'New User has join your Organization!'
            },
            rejected: {
                title: 'User Rejected',
                code: 'USER_REJECTED',
                message: 'User has rejected your Organization Invitation!'
            },
        }
    }
}

module.exports = NotificationEnum