const ClassTransactionStatusEnum = require('../../models/enum/ClassTransactionStatusEnum');
const { UnsupportedOperationError } = require('../../models/errors');
const ClassTransactionDetail = require('../../models/v2/ClassTransactionDetail');

const ErrorEnum = {
    REGISTERED_TO_SESSION: 'REGISTERED_TO_SESSION',
}

const classTransactionDetailService = {};

classTransactionDetailService.generateTransactionDetail = (transactionDetailDTOs, user, trx) => {

    return ClassTransactionDetail.query(trx)
        .insertToTable(transactionDetailDTOs, user.sub);

}

classTransactionDetailService.checkUserRegisteredToSessions = async (sessionUuids, userId) => {

    return ClassTransactionDetail.query()
        .whereIn('class_category_session_uuid', sessionUuids)
        .where('user_id', userId)
        .withGraphFetched('transaction(baseAttributes)')
        .then(transactionDetails => {
            transactionDetails.forEach(transactionDetail => {
                if (transactionDetail.transaction.status === ClassTransactionStatusEnum.DONE ||
                    transactionDetail.transaction.status === ClassTransactionStatusEnum.AWAITING_PAYMENT) {
                        throw new UnsupportedOperationError(ErrorEnum.REGISTERED_TO_SESSION);
                    }
            });
            return false;
        });

}

module.exports = classTransactionDetailService;