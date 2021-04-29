//FILE TO DELETE IF PAYMENT SEPARATED
const DokuRequest = require('../../models/v2/DokuRequest');
const parser = require('fast-xml-parser').j2xParser;
const ClassTransactionStatusEnum = require('../../models/enum/ClassTransactionStatusEnum');
const crypto = require('crypto');
const classTransactionDetailService = require('./mobileClassTransactionDetailService');
const classCategoryParticipantSessionService = require('./mobileClassCategoryParticipantSessionService');

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

    const words = crypto.createHash('sha1').update(`${price}${process.env.MALL_ID}${process.env.SHARED_KEY}${invoice}`).digest('hex');
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

    const dokuParamsXML = new parser({}).parse(dokuParamsJSON);
    console.log(dokuParamsXML)
    return dokuParamsXML;

}

dokuService.notifyRequest = async (dokuNotify) => {

    const dokuRequest = await DokuRequest.query()
        .where('trans_id_merchant', dokuNotify.TRANSIDMERCHANT)
        .first();

    dokuRequest.approvalCode = dokuNotify.APPROVALCODE;
    dokuRequest.status = ClassTransactionStatusEnum.DONE;

    return DokuRequest.transaction(async trx => {

        await dokuRequest.$query(trx)
            .updateByUserId(dokuRequest, 0);

        const detailTransactions = await classTransactionDetailService.getTransactionDetailsByInvoice(dokuNotify.TRANSIDMERCHANT);
        const participantSessionDTOs = classTransactionDetailService.generateParticipantSessionDTOs(detailTransactions);
        await classCategoryParticipantSessionService.register(participantSessionDTOs, { sub: detailTransactions[0].createBy }, trx);

        return true;
    });

}

module.exports = dokuService;