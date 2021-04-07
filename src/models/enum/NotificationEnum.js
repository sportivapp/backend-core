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
    },
    classCategory: {
        type: 'CLASS_CATEGORY',
        actions: {
            registerSuccess: {
                title: (classTitle, categoryTitle) => `Registrasi Kelas ${classTitle} Kategori ${categoryTitle}`,
                code: 'CLASS_CATEGORY_REGISTRATION_SUCCESS',
                message: () => `Registrasi kelas sukses! Cek jadwal kelasmu disini.`
            },
            finished: {
                title: (classTitle, categoryTitle) => `Kelas ${classTitle} Kategori ${categoryTitle} Selesai`,
                code: 'CLASS_CATEGORY_FINISHED',
                message: () => `Anda telah menyelesaikan semua kelas yang diikuti. Sampai jumpa kembali!`
            },
            extend: {
                title: (classTitle, categoryTitle) => `Extend Kelas ${classTitle} Kategori ${categoryTitle}`,
                code: 'CLASS_CATEGORY_EXTEND_OPTION',
                message: () => `Masa berlangsung jadwal akan segera berakhir! Perbarui jadwal anda di web.`
            }
        }
    },
    classSession: {
        type: 'CLASS_CATEGORY_SESSION',
        actions: {
            start: {
                title: (classTitle, categoryTitle) => `Sesi Kelas ${classTitle} Kategori ${categoryTitle} Dimulai`,
                code: 'CLASS_SESSION_STARTED',
                message: () => `Kelas Anda sudah dimulai, Selamat Mengikuti!`
            },
            end: {
                title: (classTitle, categoryTitle) => `Sesi Kelas ${classTitle} Kategori ${categoryTitle} Selesai`,
                code: 'CLASS_SESSION_FINISHED',
                message: (sessionTitle) => `Wah hebat! Anda telah menyelesaikan ${sessionTitle}`
            },
            requireConfirmation: {
                title: (classTitle, categoryTitle) => `Konfirmasi Sesi Kelas ${classTitle} Kategori ${categoryTitle}`,
                code: 'CLASS_SESSION_CONFIRM_REQUIRED',
                message: (sessionTitle) => `Konfirmasi kehadiran Anda pada ${sessionTitle} disini.`
            },
            sessionConfirmed: {
                title: (classTitle, categoryTitle) => `Konfirmasi Sesi Kelas ${classTitle} Kategori ${categoryTitle}`,
                code: 'CLASS_SESSION_USER_CONFIRMED',
                message: (userName, sessionTitle) => `${sessionTitle} telah di konfirmasi oleh ${userName}`
            },
            sessionsConfirmed: {
                title: (classTitle, categoryTitle) => `Konfirmasi Sesi Kelas ${classTitle} Kategori ${categoryTitle}`,
                code: 'CLASS_SESSION_USERS_CONFIRMED',
                message: (userCount, sessionTitle) => `${sessionTitle} telah di konfirmasi oleh ${userCount} peserta!`
            },
            reminder: {
                title: (classTitle, categoryTitle) => `Reminder kelas ${classTitle} Kategori ${categoryTitle}`,
                code: 'CLASS_SESSION_START_REMINDER',
                message: (sessionTitle, timeDescription) => `${sessionTitle} akan dimulai dalam waktu ${timeDescription} lagi. Persiapkan diri anda! Semangat!`
            },
            reason: {
                title: (classTitle, categoryTitle) => `Absensi Kelas ${classTitle} Kategori ${categoryTitle}`,
                code: 'CLASS_SESSION_NEW_REASON',
                message: (userName, sessionTitle) => `${userName} telah memberi alasan atas ketidakhadirannya di ${sessionTitle}.`
            },
            newParticipants: {
                title: (classTitle, categoryTitle) => `Pendaftaran Kelas ${classTitle} Kategori ${categoryTitle}`,
                code: 'CLASS_SESSION_NEW_PARTICIPANTS',
                message: (participantCount, sessionTitle) => `Ada ${participantCount} peserta baru yang mendaftar di ${sessionTitle}!`
            },
            newParticipant: {
                title: (classTitle, categoryTitle) => `Pendaftaran Kelas ${classTitle} Kategori ${categoryTitle}`,
                code: 'CLASS_SESSION_NEW_PARTICIPANT',
                message: (userName, sessionTitle) => `${userName} baru mendaftar di ${sessionTitle}!`
            },
            newComplaints: {
                title: (classTitle, categoryTitle) => `Komplain Kelas ${classTitle} Kategori ${categoryTitle}`,
                code: 'CLASS_SESSION_NEW_COMPLAINTS',
                message: (complaintCount, sessionTitle) => `Anda mendapatkan komplain untuk ${sessionTitle} dari ${complaintCount} peserta!`
            },
            newComplaint: {
                title: (classTitle, categoryTitle) => `Komplain Kelas ${classTitle} Kategori ${categoryTitle}`,
                code: 'CLASS_SESSION_NEW_COMPLAINT',
                message: (userName, sessionTitle) => `Anda mendapatkan komplain untuk ${sessionTitle} dari ${userName}!`
            },
            reschedule: {
                title: (classTitle, categoryTitle) => `Reschedule Kelas ${classTitle} Kategori ${categoryTitle}`,
                code: 'CLASS_SESSION_RESCHEDULE',
                message: (sessionTitle) => `${sessionTitle} telah di reschedule! cek jadwal baru disini!`
            },
            acceptComplaint: {
                title: (classTitle, categoryTitle) => `Komplain Kelas ${classTitle} Kategori ${categoryTitle}`,
                code: 'CLASS_SESSION_COMPLAINT_ACCEPTED',
                message: (sessionTitle) => `Komplain Anda untuk ${sessionTitle} diterima.`
            },
            rejectComplaint: {
                title: (classTitle, categoryTitle) => `Komplain Kelas ${classTitle} Kategori ${categoryTitle}`,
                code: 'CLASS_SESSION_COMPLAINT_REJECTED',
                message: (sessionTitle) => `Komplain Anda untuk ${sessionTitle} ditolak.`
            },
            newRating: {
                title: (classTitle, categoryTitle) => `Ulasan Kelas ${classTitle} Kategori ${categoryTitle}`,
                code: 'CLASS_SESSION_NEW_RATING',
                message: (userName, sessionTitle) => `${userName} telah memberi ulasan untuk ${sessionTitle}.`
            },
            newRatings: {
                title: (classTitle, categoryTitle) => `Ulasan Kelas ${classTitle} Kategori ${categoryTitle}`,
                code: 'CLASS_SESSION_NEW_RATINGS',
                message: (userCount, sessionTitle) => `${userCount} peserta telah memberi ulasan untuk ${sessionTitle}.`
            },
            finishedAttendance: {
                title: (classTitle, categoryTitle) => `Absensi Kelas ${classTitle} Kategori ${categoryTitle}`,
                code: 'CLASS_SESSION_FINISHED_ATTENDANCE',
                message: () => `Pelatihmu sudah selesai melakukan absensi! Cek status kehadiranmu.`
            }
        }
    }
}

module.exports = NotificationEnum