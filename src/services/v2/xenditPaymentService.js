const { UnsupportedOperationError } = require('../../models/errors');
const XenditPayment = require('../../models/v2/XenditPayment');
const xenditOutboundService = require('./xenditOutboundService');
const mobileClassTransactionService = require('./mobileClassTransactionService');
const uuid = require('uuid');
const { moduleTransactionEnum, moduleEnum } = require('../../models/enum/ModuleTransactionEnum');
const disbursementService = require('./disbursementService');

const paymentChannelsEnum = {
    "CREDIT_CARD": "CREDIT_CARD",
    "BCA": "BCA",
    "BNI": "BNI",
    "BSS": "BSS",
    "BRI": "BRI",
    "MANDIRI": "MANDIRI",
    "PERMATA": "PERMATA",
    "ALFAMART": "ALFAMART",
    "INDOMARET": "INDOMARET",
    "OVO": "OVO",
    "DANA": "DANA",
    "SHOPEEPAY": "SHOPEEPAY",
    "LINKAJA": "LINKAJA",
    "QRIS": "QRIS"
}

const paymentChannels = 
["CREDIT_CARD", "BCA", "BNI", "BSI", "BRI", "MANDIRI", "PERMATA",
"ALFAMART", "INDOMARET", "OVO", "DANA", "SHOPEEPAY", "LINKAJA", "QRIS"]

const xenditPaymentStatusEnum = {
    'AWAITING_PAYMENT': 'AWAITING_PAYMENT',
    'PAID': 'PAID',
    'CANCELLED_OR_EXPIRED': 'CANCELLED_OR_EXPIRED',
    'REFUSED_OR_ERROR': 'REFUSED_OR_ERROR',
    'REFUNDED': 'REFUNDED'
}

const invoiceStatusEnum = {
    PAID: 'PAID',
    EXPIRED: 'EXPIRED',
}

const ErrorEnum = {
    PAID_AMOUNT_NOT_MATCH: 'PAID_AMOUNT_NOT_MATCH',
    PAYMENT_CHANNEL_NOT_SUPPORTED: 'PAYMENT_CHANNEL_NOT_SUPPORTED',
    INVALID_INVOICE_STATUS: 'INVALID_INVOICE_STATUS',
    INVALID_INVOICE: 'INVALID_INVOICE',
    INVALID_ID: 'INVALID_ID',
    NOT_INVOICE_OWNER: 'NOT_INVOICE_OWNER',
}

const xenditPaymentService = {};

xenditPaymentService.getPaymentChannels = () => {

    return paymentChannels;

}

xenditPaymentService.createXenditPayment = async (invoice, amount, description, invoiceDuration, items, paymentChannel, paymentDetails, user) => {

    if (!paymentChannelsEnum[paymentChannel]) {
        throw new UnsupportedOperationError(ErrorEnum.PAYMENT_CHANNEL_NOT_SUPPORTED);
    }

    const paymentUuid = uuid.v4();

    return XenditPayment.transaction(async trx => {

        const xenditResponse = await xenditOutboundService.generateXenditInvoice(paymentUuid, amount, 
            description, invoiceDuration, user.name, user.email, items, [paymentChannel]);

        const paymentDTO = {
            uuid: paymentUuid,
            invoice: invoice,
            amount: amount,
            description: description,
            expiryDate: xenditResponse.expiryDate,
            name: user.name,
            email: user.email,
            items: JSON.stringify(items),
            status: xenditPaymentStatusEnum.AWAITING_PAYMENT,
            xenditInvoiceId: xenditResponse.id,
            invoiceUrl: xenditResponse.invoiceUrl,
            paymentDetails: JSON.stringify(paymentDetails),
            paymentMethod: paymentChannel,
        }

        const xenditPayment = await XenditPayment.query(trx)
            .insertToTable(paymentDTO, user.sub);

        return {
            ...xenditPayment,
            invoiceUrl: xenditPayment.invoiceUrl
        }
        
    })

}

xenditPaymentService.receivePayment = async (payload) => {

    // get the paid payment by uuid
    // external id is our xenditpayment uuid that we sent
    const xenditPayment = await XenditPayment.query()
        .where('uuid', payload.external_id)
        .first();

    if (parseInt(xenditPayment.amount) !== payload.paid_amount)
        throw new UnsupportedOperationError(ErrorEnum.PAID_AMOUNT_NOT_MATCH);

    if (!invoiceStatusEnum[payload.status])
        throw new UnsupportedOperationError(ErrorEnum.INVALID_INVOICE_STATUS);

    // NOTE: Haven't handled what to do when the status is EXPIRED instead of PAID
    if (payload.status === invoiceStatusEnum.PAID) {

        await XenditPayment.query()
        .where('uuid', payload.external_id)
        .updateByUserId({
            status: invoiceStatusEnum.PAID,
            paymentMethod: payload.payment_method,
            paymentChannel: payload.payment_channel,
            paymentDestination: payload.payment_destination,
            fees: payload.fees_paid_amount,
            adjustedAmount: payload.adjustedReceivedAmount,
        }, 0);

        const paymentType = xenditPayment.invoice.split('/')[2];
        if (paymentType === moduleTransactionEnum[moduleEnum.CLASS]) {
            await mobileClassTransactionService.processInvoice(xenditPayment.invoice);
        }

        const disbursementDTO = {
            userId: xenditPayment.createBy,
            xenditPaymentUuid: xenditPayment.uuid,
            invoice: xenditPayment.invoice,
            amount: xenditPayment.amount,
        }
        await disbursementService.createDisbursement(disbursementDTO);

    }

    return 'success'
    
}

xenditPaymentService.getInvoiceStatus = async (invoice) => {

    const xenditPayment = await XenditPayment.query()
        .where('invoice', invoice)
        .first();

    if(!xenditPayment)
        throw new UnsupportedOperationError(ErrorEnum.INVALID_INVOICE);

    return {
        status: xenditPayment.status
    }

}

xenditPaymentService.getAwaitingPayments = async (user) => {

    const userId = user.sub;
    
    const awaitingPayments = await XenditPayment.query()
        .where('create_by', userId)
        .where('status', xenditPaymentStatusEnum.AWAITING_PAYMENT)
        .where('expiry_date', '>=', new Date().toISOString());

    return awaitingPayments.map(awaitingPayment => {
        let type = awaitingPayment.invoice.split('/')[2];
        let paymentType = '';

        if (type === moduleTransactionEnum.CLASS) {
            paymentType = moduleEnum.CLASS
        }

        let className = ''
        const paymentDetails = JSON.parse(awaitingPayment.paymentDetails);
        if (paymentDetails)
            className = paymentDetails.itemHeader.title

        return {
            name: className,
            uuid: awaitingPayment.uuid,
            status: awaitingPayment.status,
            invoice: awaitingPayment.invoice,
            price: parseInt(awaitingPayment.amount),
            expiryDate: awaitingPayment.expiryDate,
            paymentType: paymentType,
            invoiceUrl: awaitingPayment.invoiceUrl,
        }
    })
}

xenditPaymentService.getPaymentDetail = async (xenditPaymentUuid, user) => {

    const xenditPayment = await XenditPayment.query()
        .findById(xenditPaymentUuid);

    if(!xenditPayment)
        throw new UnsupportedOperationError(ErrorEnum.INVALID_ID);
    if(xenditPayment.createBy !== user.sub)
        throw new UnsupportedOperationError(ErrorEnum.NOT_INVOICE_OWNER);
    
    const parsedPaymentDetails = JSON.parse(xenditPayment.paymentDetails);

    return {
        invoice: xenditPayment.invoice,
        paymentDate: xenditPayment.changeTime,
        paymentMethod: xenditPayment.paymentMethod,
        name: xenditPayment.name,
        isPaid: xenditPayment.status === invoiceStatusEnum.PAID ? true : false,
        ...parsedPaymentDetails
    }

}

module.exports = xenditPaymentService;