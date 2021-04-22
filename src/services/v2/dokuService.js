//FILE TO DELETE IF PAYMENT SEPARATED
const DokuRequest = require('../../models/v2/DokuRequest');
const j2xParser = require('fast-xml-parser');
const ClassTransactionStatusEnum = require('../../models/enum/ClassTransactionStatusEnum');

const dokuService = {};

dokuService.generatePaymentParams = async (invoice, price, customerName, customerEmail, paymentChannel, timeLimit) => {

    const d = new Date();
    const requestDateTime = `${d.getFullYear()}${d.getMonth()}${d.getDate()}${d.getHours()}${d.getMinutes()}${d.getSeconds()}`;

    const dokuRequest = {
        transIdMerchant: invoice,
        amount: price,
        purchaseAmount: price,
        timeLimit: timeLimit,
        requestDateTime: requestDateTime,
        sessionId: 'abc',
        basket: `item1,${price},1,${price}`,
        paymentChannel: paymentChannel,
        customerName: customerName,
        customerEmail: customerEmail,
    }

    await DokuRequest.query()
        .insertToTable(dokuRequest, 0);

    const words = createHash('sha1').update(`${price}${process.env.MALL_ID}${process.env.SHARED_KEY}${invoice}`).digest('hex');
    const dokuParamsJSON = {
        MALLID: process.env.MALL_ID,
        CHAINMERCHANT: process.env.CHAIN_MERCHANT,
        AMOUNT: price,
        PURCHASEAMOUNT: price,
        TRANSIDMERCHANT: invoice,
        WORDS: words,
        REQUESTDATETIME: requestDateTime,
        CURRENCY: 360,
        PURCHASECURRENCY: 360,
        // TODO: do this right (SESSIONID, BASKET)
        SESSIONID: 'abc',
        BASKET: `item1,${price},1,${price}`,
        PAYMENTCHANNEL: paymentChannel,
        CUSTOMERNAME: customerName,
        CUSTOMEREMAIL: customerEmail,
    }
    return new j2xParser.parse(dokuParamsJSON);

}

dokuService.notifyRequest = async (dokuNotify) => {

    const dokuNotifyJSON = j2xParser.convertToJson(dokuNotify);

    const dokuRequest = await DokuRequest.query()
        .where('invoice', dokuNotifyJSON.TRANSIDMERCHANT);

    dokuRequest.approvalCode = dokuNotifyJSON.APPROVALCODE;
    dokuRequest.status = ClassTransactionStatusEnum.DONE;

    await dokuRequest.$query()
        .updateByUserId(dokuRequest, 0);
    
    return true;

}

module.exports = dokuService;