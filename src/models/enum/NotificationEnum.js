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
                title: 'Forum baru!',
                code: 'NEW_THREAD',
                message: (sender, title) => `${sender} telah membuat forum ${title}`
            },
            comment: {
                title: 'Komentar baru!',
                code: 'NEW_THREAD_POST',
                message: (sender) => `Anda mendapat komentar dari ${sender}. Periksa sekarang!`
            },
            reply: {
                title: 'Balasan baru!',
                code: 'NEW_THREAD_POST_REPLY',
                message: (sender) => `${sender} membalas komentar dari forum anda. Periksa sekarang!`
            }
        }
    },
    forumPost: {
        type: 'THREAD_POST',
        actions: {
            reply: {
                title: 'Balasan baru!',
                code: 'NEW_THREAD_REPLY',
                message: (sender) => `Anda mendapat balasan dari ${sender}. Periksa sekarang!`
            },
            comment: {
                title: 'Komentar baru!',
                code: 'NEW_THREAD_POST',
                message: (sender) => `Ada komentar baru dari ${sender}. Periksa sekarang!`
            }
        }
    },
    forumPostReply: {
        type: 'THREAD_POST_REPLY',
        actions: {
            reply: {
                title: 'Balasan baru!',
                code: 'NEW_THREAD_REPLY',
                message: (sender) => `Anda mendapat balasan dari ${sender}. Periksa sekarang!`
            },
        }
    },
    news: {
        type: 'NEWS',
        actions: {
            create: {
                title: 'Berita baru!',
                code: 'NEW_NEWS',
                message: (title) => `Ada Berita ${title}. Periksa sekarang!`
            }
        }
    }
}

module.exports = NotificationEnum