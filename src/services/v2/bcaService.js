//FILE TO DELETE IF PAYMENT SEPARATED
const BCARequest = require('../../models/v2/BCARequest');
const DokuRequest = require('../../models/v2/BCARequest');
const ClassTransactionStatusEnum = require('../../models/enum/ClassTransactionStatusEnum');
const crypto = require('crypto');
const classTransactionDetailService = require('./mobileClassTransactionDetailService');
const classCategoryParticipantSessionService = require('./mobileClassCategoryParticipantSessionService');
const { UnauthorizedError, UnsupportedOperationError } = require('../../models/errors');
const jwtService = require('../common/jwtService');

const bcaService = {};

bcaService.generateOauthToken = async (basicToken, grantType) => {
    if (grantType !== 'client_credentials') throw new UnauthorizedError();
    const authStrings = Buffer.from(basicToken, 'base64').toString('ascii').split(':');
    const clientId = authStrings[0];
    const clientSecret = authStrings[1];
    if (process.env.CLIENT_ID !== clientId) throw new UnauthorizedError();
    if (process.env.CLIENT_SECRET !== clientSecret) throw new UnauthorizedError();
    const payload = {
        id: clientId,
        name: 'BCA'
    }
    return jwtService.sign(payload, '3600s')
        .then(token => ({
            access_token: token,
            token_type: 'Bearer',
            expires_in: '3600s',
        }))
}

bcaService.verifyOauthToken = async (token) => {
    return jwtService.verify(token, false)
        .then(() => true)
        .catch(() => false)
}

bcaService.getAllPaymentBills = async (vaNumber, requestId, transactionDate) => {

    return BCARequest.query()
        .updateByUserId({ bcaRequestId: requestId, bcaTransactionDate: transactionDate }, 0)
        .where('va_number', vaNumber)
        .andWhere('status', 'AWAITING_PAYMENT')
        .returning('*');
}

bcaService.receivePaymentInvocation = async (vaNumber, requestId, transactionDate) => {

    return BCARequest.transaction(async trx => {

        const payments = await BCARequest.query(trx)
            .updateByUserId({ status: 'DONE' }, 0)
            .where('va_number', vaNumber)
            .andWhere('bca_request_id', requestId)
            .andWhere('bca_transaction_date', transactionDate)
            .andWhere('status', 'AWAITING_PAYMENT')
            .returning('*');

        const detailTransactions = await classTransactionDetailService.getTransactionDetailsByInvoices(payments.map(payment => payment.invoice));
        const participantSessionDTOs = classTransactionDetailService.generateParticipantSessionDTOs(detailTransactions);
        await classCategoryParticipantSessionService.register(participantSessionDTOs, { sub: detailTransactions[0].createBy }, trx);

        return payments;
    })
}

bcaService.createBCARequest = async (paymentRequest, user) => {
    const bcaPayment = {
        timeLimit: paymentRequest.timeLimit,
        amount: paymentRequest.amount,
        invoice: paymentRequest.invoice,
        subCompanyId: paymentRequest.productCode,
        customerName: user.name,
        customerEmail: user.email,
        va_number: process.env.BCA_COMPANY_CODE + user.mobileNumber,
        status: 'AWAITING_PAYMENT'
    };

    return BCARequest.query().insertToTable(bcaPayment, user.sub)
        .then(data => data.va_number)
        .catch(() => {
            throw new UnsupportedOperationError('CREATE_PAYMENT_FAIL');
        });
}

module.exports = bcaService;