const NotificationEnum = {
    company: {
        type: 'COMPANY',
        actions: {

        }
    },
    forum: {
        type: 'THREAD',
        actions: {
            create: {
                title: 'New Forum',
                code: 'NEW_FORUM',
                message: 'A user has created a new forum!'
            }
        }
    },
    forumPost: {
        type: 'THREAD_POST',
        actions: {
            post: {
                title: 'Forum Post',
                code: 'FORUM_POST',
                message: 'A user has posted in your forum!'
            }
        }
    },
    forumPostReply: {
        type: 'THREAD_POST_REPLY',
        actions: {
            reply: {
                title: 'Forum Reply',
                code: 'FORUM_REPLY',
                message: 'A user has replied to your post in a forum!'
            }
        }
    },
    class: {
        type: 'CLASS',
        actions: {
            register: {
                title: 'Register Class',
                code: 'REGISTER_CLASS',
                message: 'A User has registered to a Class!'
            },
            approved: {
                title: 'Approved Class',
                code: 'APPROVED_CLASS',
                message: 'Your class registration has been approved!'
            },
            rejected: {
                title: 'Rejected Class',
                code: 'REJECTED_CLASS',
                message:'Your class registration has been rejected!'
            },
            canceled: {
                title: 'Canceled Class',
                code: 'CANCELED_CLASS',
                message:'A user canceled its registration to a class!'
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
            }
        }
    },
    announcement: {
        type : 'ANNOUNCEMENT',
        actions : {
            publish : {
                title: 'New Announcement',
                code: 'NEW_ANNOUNCEMENT',
                message: 'You got a new Announcement!'
            }
        }
    }
}

module.exports = NotificationEnum