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

    }
}

module.exports = NotificationEnum