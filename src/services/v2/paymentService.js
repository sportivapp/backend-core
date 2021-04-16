const paymentMethodEnum = require('../../models/enum/PaymentMethodEnum');
const paymentStatusEnum = require('../../models/enum/PaymentStatusEnum');
const { UnsupportedOperationError } = require('../../models/errors');
const ClassTransaction = require('../../models/v2/ClassTransaction');

const ErrorEnum = {
    TIMEOUT: 'TIMEOUT',
    INVOICE_NOT_FOUND: 'INVOICE_NOT_FOUND',
    INVALID_STATUS: 'INVALID_STATUS',
}

const paymentService = {};

paymentService.getPaymentMethods = () => {

    return paymentMethodEnum;

}

paymentService.updatePayment = async (invoice, status) => {

    if (!paymentStatusEnum[status])
        throw new UnsupportedOperationError(ErrorEnum.INVALID_STATUS);

    const classTransaction = await ClassTransaction.query()
    .where('invoice', invoice)
    .first()
    .then(classTransaction => {
        if (!classTransaction)
            throw new UnsupportedOperationError(ErrorEnum.INVOICE_NOT_FOUND);
        return classTransaction;
    });

    if (classTransaction.timeLimit < Date.now())
        throw new UnsupportedOperationError(ErrorEnum.TIMEOUT);

    return classTransaction.$query().patch({
        status: status,
    }).returning('*');

}

module.exports = paymentService;