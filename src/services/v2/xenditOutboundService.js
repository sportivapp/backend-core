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

const Xendit = require('xendit-node');
const x = new Xendit({
  secretKey: process.env.XENDIT_API_KEY,
});
const { Invoice } = x;
const invoiceSpecificOptions = {};
const i = new Invoice(invoiceSpecificOptions);

const xenditService = {}

xenditService.generateXenditInvoice = async (externalId, amount, description, userName, userEmail, items) => {

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
        items: items
        //payment_methods
        //success_redirect_url,
    });

    return {
        id: response.id,
        url: response.invoice_url,
        expiryDate: response.expiryDate
    }

}

module.exports = xenditService;