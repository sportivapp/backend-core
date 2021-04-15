const paymentMethodEnum = require('../../models/enum/PaymentMethodEnum');
const paymentService = {};

paymentService.getPaymentMethods = () => {

    return paymentMethodEnum;

}

module.exports = paymentService;