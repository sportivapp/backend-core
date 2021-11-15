const xenditPaymentService = require('../../../services/v2/xenditPaymentService');
const ResponseHelper = require('../../../helper/ResponseHelper');

const xenditPaymentController = {};

xenditPaymentController.receivePayment = async (req, res, next) => {

    try {

        const payload = req.body;

        const result = xenditPaymentService.receivePayment(payload);
        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

xenditPaymentController.getPaymentChannels = (req, res, next) => {

    try {

        const result = xenditPaymentService.getPaymentChannels();
        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

xenditPaymentController.getInvoiceStatus = async (req, res, next) => {

    const { invoice } = req.body;

    try {

        const result = await xenditPaymentService.getInvoiceStatus(invoice);
        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

module.exports = xenditPaymentController;