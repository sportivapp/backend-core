const { UnsupportedOperationError } = require('../../models/errors');
const XenditPayment = require('../../models/v2/XenditPayment');
const xenditOutboundService = require('./xenditOutboundService');
const mobileClassTransactionService = require('./mobileClassTransactionService');

const paymentChannelsEnum = {
    "CREDIT_CARD": "CREDIT_CARD",
    "BCA": "BCA",
    "BNI": "BNI",
    "BSI": "BSI",
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
    INVALID_INVOICE_STATUS: 'INVALID_INVOICE_STATUS'
}

const xenditPaymentService = {};

xenditPaymentService.getPaymentChannels = () => {

    return paymentChannels;

}

xenditPaymentService.createXenditPayment = async (invoice, amount, description, expiryDate, items, paymentChannel, user) => {

    if (!paymentChannelsEnum[paymentChannel]) {
        throw new UnsupportedOperationError(ErrorEnum.PAYMENT_CHANNEL_NOT_SUPPORTED);
    }

    const paymentDTO = {
        invoice: invoice,
        amount: amount,
        description: description,
        expiryDate: expiryDate,
        name: user.name,
        email: user.email,
        items: JSON.stringify(items),
        status: xenditPaymentStatusEnum.AWAITING_PAYMENT,
    }

    return XenditPayment.transaction(async trx => {
        
        const xenditPayment = await XenditPayment.query(trx)
            .insertToTable(paymentDTO, user.sub);

        const xenditResponse = await xenditOutboundService.generateXenditInvoice(xenditPayment.uuid, amount, 
            xenditPayment.description, xenditPayment.name, xenditPayment.email, JSON.parse(xenditPayment.items), [paymentChannel]);
    
        const updatedPayment = await XenditPayment.query(trx)
            .findById(xenditPayment.uuid)
            .updateByUserId({
                xenditInvoiceId: xenditResponse.id,
                invoiceUrl: xenditResponse.invoiceUrl,
            }, user.sub)
        
        return {
            ...updatedPayment,
            invoiceUrl: xenditResponse.invoiceURl
        }
        
    })

}

xenditPaymentService.receivePayment = async (payload) => {

    // get the paid payment by uuid
    // external id is our xenditpayment uuid that we sent
    const xenditPayment = await XenditPayment.query()
        .findById(payload.external_id);

    if (xenditPayment.amount !== payload.paid_amount)
        throw new UnsupportedOperationError(ErrorEnum.PAID_AMOUNT_NOT_MATCH);

    if (!invoiceStatusEnum[payload.status])
        throw new UnsupportedOperationError(ErrorEnum.INVALID_INVOICE_STATUS);

    // NOTE: Haven't handled what to do when the status is EXPIRED instead of PAID
    if (payload.status === invoiceStatusEnum.PAID) {

        await XenditPayment.query()
        .findById(payload.external_id)
        .updateByUserId({
            status: invoiceStatusEnum.PAID,
            paymentMethod: payload.payment_method,
            paymentChannel: payload.payment_channel,
            paymentDestination: payload.payment_destination,
            fees: payload.fees_paid_amount,
            adjustedAmount: payload.adjustedReceivedAmount,
        }, 0);

        const paymentType = xenditPayment.invoice.split('/')[2];
        if (paymentType.toLowerCase() === 'class') {
            await mobileClassTransactionService.processInvoice(xenditPayment.invoice);
        }

    }

    return 'success'
    
}

module.exports = xenditPaymentService;