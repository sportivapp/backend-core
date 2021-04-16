const paymentService = require('../../../services/v2/paymentService');
const ResponseHelper = require('../../../helper/ResponseHelper');

const paymentController = {};

paymentController.getPaymentMethods = (req, res, next) => {

    try {

        const result = paymentService.getPaymentMethods();
        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

paymentController.updatePayment = (req, res, next) => {

    const { invoice } = req.params;

    try {

        const result = paymentService.updatePayment(invoice);
        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

module.exports = paymentController;