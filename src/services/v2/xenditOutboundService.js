const Xendit = require('xendit-node');
const x = new Xendit({
  secretKey: process.env.XENDIT_API_KEY,
});
const { Invoice } = x;
const invoiceSpecificOptions = {};
const i = new Invoice(invoiceSpecificOptions);

const xenditService = {}

xenditService.generateXenditInvoice = async (externalId, amount, description, invoiceDuration, userName, userEmail, items, paymentChannels) => {

    // NOTE: please save this id and other data to xendit payment table
    const response = await i.createInvoice({
        externalID: externalId,
        amount: amount,
        description: description,
        customer: {
            given_names: userName,
            email: userEmail
        },
        invoiceDuration: invoiceDuration,
        currency: 'IDR',
        // items: items,
        paymentMethods: paymentChannels,
        success_redirect_url: 'https://booking.sportiv.asia/',
    });

    return {
        id: response.id,
        invoiceUrl: response.invoice_url,
        expiryDate: response.expiry_date
    }

}

module.exports = xenditService;