const { UnsupportedOperationError } = require('../../models/errors');
const XenditPayment = require('../../models/v2/XenditPayment');
const xenditOutboundService = require('./xenditOutboundService');

const xenditPaymentStatusEnum = {
    'AWAITING_PAYMENT': 'AWAITING_PAYMENT',
    'PAID': 'PAID',
    'CANCELLED_OR_EXPIRED': 'CANCELLED_OR_EXPIRED',
    'REFUSED_OR_ERROR': 'REFUSED_OR_ERROR',
    'REFUNDED': 'REFUNDED'
}

const xenditPaymentService = {};

xenditPaymentService.createXenditPayment = async (invoice, amount, description, expiryDate, items, user) => {

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

        const xenditResponse = await xenditOutboundService.generateXenditInvoice(XenditPayment.id, amount, 
            XenditPayment.description, XenditPayment.name, XenditPayment.email, JSON.parse(XenditPayment.items));
    
        const updatedPayment = await XenditPayment.query(trx)
            .findById(xenditPayment.uuid)
            .updateByUserId({
                invoice: xenditResponse.id,
                expiryDate: new Date(xenditResponse.expiryDate).getTime(),
                invoiceUrl: xenditResponse.invoice_url
            }, user.sub)
        
        return {
            ...updatedPayment,
            invoiceUrl: xenditResponse.invoice_url
        }
        
    })

}

module.exports = xenditPaymentService;