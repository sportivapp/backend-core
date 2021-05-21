//FILE TO DELETE IF PAYMENT SEPARATED
const bcaService = require("../../../services/v2/bcaService");
const { UnauthorizedError } = require('../../../models/errors')
const ResponseHelper = require('../../../helper/ResponseHelper');

const bcaController = {};

bcaController.getOauthToken = async (req, res, next) => {

    const authorization = req.headers['authorization']
    const { grant_type } = req.body;
    const basicToken = authorization.split(' ')[1];

    return bcaService.generateOauthToken(basicToken, grant_type)
        .then(response => res.status(200).json(response))
        .catch(next);

}

bcaController.getAllPaymentBills = async (req, res, next) => {

    await verifyToken(req.headers, next);

    const { CustomerNumber, RequestID, TransactionDate } = req.body;

    return bcaService.getAllPaymentBills(CustomerNumber, RequestID, TransactionDate)
        .then(payments => toBCABillWebResponseWithInquiry(req.body, payments))
        .then(ResponseHelper.toBaseResponse)
        .then(response => res.status(200).json(response))
        .catch(next);

}

bcaController.receivePaymentInvocation = async (req, res, next) => {

    await verifyToken(req.headers, next);

    const { CustomerNumber, RequestID, TransactionDate } = req.body;

    return bcaService.receivePaymentInvocation(CustomerNumber, RequestID, TransactionDate)
        .then(payments => toBCABillWebResponseWithPaymentFlag(req.body, payments))
        .then(ResponseHelper.toBaseResponse)
        .then(response => res.status(200).json(response))
        .catch(next);
}

async function verifyToken(headers, next) {

    const authorization = headers['authorization']
    if (!authorization || authorization === '') next(new UnauthorizedError());
    const token = authorization.split(' ')[1];

    await bcaService.verifyOauthToken(token).catch(next);
}

function toBCABillWebResponseWithInquiry (webRequest, payments) {
    const webResponse = {};
    webResponse.RequestID = webRequest.RequestID;
    webResponse.CompanyCode = process.env.BCA_COMPANY_CODE;
    webResponse.CurrencyCode = 'IDR';
    webResponse.CustomerNumber = webRequest.CustomerNumber;
    webResponse.CustomerName = payments.length > 0 ? payments[0].customerName : webRequest.CustomerNumber;
    webResponse.InquiryReason = { Indonesian: 'Sukses', English:  'Success' };
    webResponse.InquiryStatus = '00';
    let total = 0.0;
    payments.forEach(payment => {
        total += parseFloat(payment.amount);
    });
    webResponse.TotalAmount = total.toString();
    webResponse.DetailBills = [];
    webResponse.FreeTexts = [];
    return webResponse;
}

function toBCABillWebResponseWithPaymentFlag (webRequest, payments) {
    const webResponse = {};
    webResponse.RequestID = webRequest.RequestID;
    webResponse.CompanyCode = process.env.BCA_COMPANY_CODE;
    webResponse.CurrencyCode = 'IDR';
    webResponse.CustomerNumber = payments[0].vaNumber;
    webResponse.CustomerName = payments[0].customerName;
    webResponse.PaymentFlagReason = { Indonesian: 'Sukses', English:  'Success' };
    webResponse.PaymentFlagStatus = '00';
    let total = 0.0;
    payments.forEach(payment => {
        total += parseFloat(payment.amount);
    });
    webResponse.TotalAmount = total.toString();
    webResponse.PaidAmount = total.toString();
    webResponse.DetailBills = [];
    webResponse.FreeTexts = [];
    return webResponse;
}

module.exports = bcaController;