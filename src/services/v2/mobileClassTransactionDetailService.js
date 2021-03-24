const ClassTransactionDetail = require('../../models/v2/ClassTransactionDetail');

const classTransactionDetailService = {};

classTransactionDetailService.generateTransactionDetail = (transactionDetailDTOs, user, trx) => {

    return ClassTransactionDetail.query(trx)
        .insertToTable(transactionDetailDTOs, user.sub);

}

module.exports = classTransactionDetailService;