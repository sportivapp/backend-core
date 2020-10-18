const ReportThread = require('../models/ReportThread')
const threadService = require('./threadService')
const threadPostService = require('./threadPostService')
const threadPostReplyService = require('./threadPostReplyService')
const emailService = require('../helper/emailService')

const reportThreadService = {}

const ErrorEnum = {
    THREAD_NOT_FOUND: 'THREAD_NOT_FOUND',
    COMMENT_NOT_FOUND: 'COMMENT_NOT_FOUND',
    REPLY_NOT_FOUND: 'REPLY_NOT_FOUND'
}

reportThreadService.report = async (message, threadId, commentId, replyId, user) => {

    if (threadId) {
        const thread = await threadService.getThreadDetailById(threadId)
        if (!thread) throw new UnsupportedOperationError(ErrorEnum.THREAD_NOT_FOUND)
    }

    if (commentId) {
        const comment = await threadPostService.getPostById(commentId).catch(() => null)
        if (!comment) throw new UnsupportedOperationError(ErrorEnum.COMMENT_NOT_FOUND)
    }

    if (replyId) {
        const reply = await threadPostReplyService.getReplyById(replyId)
        if (!reply) throw new UnsupportedOperationError(ErrorEnum.REPLY_NOT_FOUND)
    }

    const dto = {
        ereportthreadmessage: message,
        ethreadethreadid: threadId,
        ethreadpostethreadpostid: commentId,
        ethreadpostreplyethreadpostreplyid: replyId
    }

    let report = await ReportThread.query()
        .insertToTable(dto, user.sub)

    report = await report.$query()
        .modify('baseAttributes')

    const callback = (error, _) => {
        if (error) {
            console.log(error)
            report = ReportThread.query()
                .findById(report.ereportthreadid)
                .updateByUserId({ ereportthreadsent: false })
        }
    }

    emailService.sendReportThread(report, callback)

    return report

}

module.exports = reportThreadService