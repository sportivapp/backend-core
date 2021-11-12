const Xendit = require('xendit-node');
const x = new Xendit({
  secretKey: process.env.XENDIT_API_KEY,
});
const { Invoice } = x;
const invoiceSpecificOptions = {};
const i = new Invoice(invoiceSpecificOptions);

const xenditService = {}

xenditService.generateXenditInvoice = async (externalId, amount, description, userName, userEmail, items, paymentChannels) => {

    // NOTE: please save this id and other data to xendit payment table
    const response = await i.createInvoice({
        externalID: externalId,
        amount: amount,
        description: description,
        customer: {
            given_names: userName,
            email: userEmail
        },
        currency: 'IDR',
        // items: items,
        payment_methods: paymentChannels,
        //success_redirect_url,
    });

    return {
        id: response.id,
        invoiceUrl: response.invoice_url,
        expiryDate: response.expiryDate
    }

}

module.exports = xenditService;