const ReportThread = require('../models/ReportThread')
const ReportThreadType = require('../models/ReportThreadType')
const threadService = require('./threadService')
const threadPostService = require('./threadPostService')
const threadPostReplyService = require('./threadPostReplyService')
const emailService = require('../helper/emailService')
const { UnsupportedOperationError } = require('../models/errors')

const reportThreadService = {}

const ErrorEnum = {
    THREAD_NOT_FOUND: 'THREAD_NOT_FOUND',
    COMMENT_NOT_FOUND: 'COMMENT_NOT_FOUND',
    REPLY_NOT_FOUND: 'REPLY_NOT_FOUND',
    TYPE_NOT_FOUND: 'TYPE_NOT_FOUND'
}

reportThreadService.report = async (message, threadId, commentId, replyId, typeId, user) => {

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

    const type = await reportThreadService.getReportTypeById(typeId)
    if (!type) throw new UnsupportedOperationError(ErrorEnum.TYPE_NOT_FOUND)

    const dto = {
        ereportthreadmessage: message,
        ethreadethreadid: threadId,
        ethreadpostethreadpostid: commentId,
        ethreadpostreplyethreadpostreplyid: replyId,
        ereportthreadtypeereportthreadtypeid: typeId
    }

    let report = await ReportThread.query()
        .insertToTable(dto, user.sub)

    report = await report.$query()
        .modify('baseAttributes')

    const callback = (error, _) => {
        if (error) {
            report = ReportThread.query()
                .findById(report.ereportthreadid)
                .updateByUserId({ ereportthreadsent: false })
        }
    }

    emailService.sendReportThread(report, callback)

    return report

}

reportThreadService.getReportTypeById = async (reportTypeId) => {

    return ReportThreadType.query()
        .findById(reportTypeId)
}

reportThreadService.getReportTypes = async () => {

    return ReportThreadType.query()
        .modify('baseAttributes')
}

module.exports = reportThreadService