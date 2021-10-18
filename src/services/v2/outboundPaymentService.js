const axios = require('axios')

const outboundPaymentService = {};

outboundPaymentService.createDOKUPayment = (invoice, amount, customerName, customerEmail, paymentChannel, timeLimit) => {

    const payload = {
        invoice: invoice,
        amount: amount,
        customerName: customerName,
        customerEmail: customerEmail,
        paymentChannel: paymentChannel,
        timeLimit: timeLimit
    };

    return axios.post(process.env.BACKEND_PAYMENT_URL + '/doku-payment', payload)
        .then(() => true)
        .catch(e => {
            console.log(e);
            return false;
        });
}

module.exports = outboundPaymentService;