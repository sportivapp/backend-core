const ClassTransaction = require('../../models/v2/ClassTransaction');

const classTransactionService = {};

classTransactionService.generateTransaction = async (participant, user, trx) => {

    return ClassTransaction.query(trx)
        .insertToTable({
            classUuid: participant.class.uuid,
            classCategoryUuid: participant.classCategory.uuid,
            userId: participant.user.euserid,
            classTitle: participant.class.title,
            categoryTitle: participant.classCategory.title,
            userName: participant.user.eusername,
            classCategoryParticipantUuid: participant.uuid,
            monthUtc: participant.monthUtc,
            start: participant.start,
            end: participant.end,
        }, user.sub);
        
}

module.exports = classTransactionService;