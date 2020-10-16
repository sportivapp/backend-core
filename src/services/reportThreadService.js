const ReportThread = require('../models/ReportThread')
const threadService = require('./threadService')
const threadPostService = require('./threadPostService')
const threadPostReplyService = require('./threadPostReplyService')
const emailService = require('../helper/emailService')

const reportThreadService = {}

reportThreadService.report = async (message, threadId, commentId, replyId, user) => {

    if (threadId) {
        const thread = await threadService.getThreadById(threadId)
    }

    if (commentId) {
        const comment = await threadPostService.getPostById(commentId)
    }

    if (replyId) {
        const reply = await threadPostReplyService.getReplyById(replyId)
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

    const callback = (_, data) => {
        if (data) {
            report = ReportThread.query()
                .findById(report.ereportthreadid)
                .updateByUserId({ ereportthreadsent: true })
        }
    }

    emailService.sendReportThread(report, callback)

    return report

}

module.exports = reportThreadService