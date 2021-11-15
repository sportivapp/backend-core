const ClassTransaction = require('../../models/v2/ClassTransaction');
const ClassTransactionSequence = require('../../models/v2/ClassTransactionSequence');
const { moduleTransactionEnum, moduleEnum } = require('../../models/enum/ModuleTransactionEnum');
const classTransactionStatusEnum = require('../../models/enum/ClassTransactionStatusEnum');
const classCategoryParticipantSessionService = require('./mobileClassCategoryParticipantSessionService');
const classTransactionDetailService = require('./mobileClassTransactionDetailService');
const zeroPrefixHelper = require('../../helper/zeroPrefixHelper');
const dateFormatter = require('../../helper/dateFormatter');
const outboundPaymentService = require('./outboundPaymentService');
const { UnsupportedOperationError } = require('../../models/errors');
const dokuService = require('./dokuService');
const bcaService = require('./bcaService');
const paymentMethodEnum = require('../../models/enum/PaymentMethodEnum');

const ErrorEnum = {
    INVALID_PAYMENT_CHANNEL_CODE: 'INVALID_PAYMENT_CHANNEL_CODE',
}

const classTransactionService = {};

classTransactionService.recurringPrice = (category, sessions) => {

    const months = [];

    const foundMonth = {};
    sessions.forEach(session => {
        if (!foundMonth[session.month]) {
            foundMonth[session.month] = true;
            months.push(session.month);
        }
    });

    return parseInt(category.price) * months.length;

}

classTransactionService.nonRecurringPrice = (sessions) => {

    return sessions.reduce((sum, sess) => sum + parseInt(sess.price), 0);

}

// May be used later for normal booking (not recurring or packaged)
classTransactionService.normalPrice = (category, sessions) => {

    // change to session.price to category.price if decision all session price is the same and stated on category.
    let price = 0
    sessions.forEach(session => {
        price += session.price;
    });

    return price;

}

classTransactionService.generateDetailTransactionDTOs = (classTransaction, cls, category, sessions, invoice, user) => {

    return sessions.map(session => {
        return {
            classUuid: cls.uuid,
            classCategoryUuid: category.uuid,
            classCategorySessionUuid: session.uuid,
            userId: user.sub,
            classSessionStartDate: session.startDate,
            classSessionEndDate: session.endDate,
            classTransactionUuid: classTransaction.uuid,
            invoice: invoice,
        };
    });

}

classTransactionService.generateClassTransactionDTO = (cls, category, invoice, amount, status, timeLimit, user) => {

    return {
        invoice: invoice,
        classUuid: cls.uuid,
        classCategoryUuid: category.uuid,
        userId: user.sub,
        classTitle: cls.title,
        categoryTitle: category.title,
        userName: user.name,
        amount: amount,
        status: status,
        timeLimit: timeLimit
    }

}

classTransactionService.generateInvoice = async () => {

    const invoiceCode = await ClassTransactionSequence.getNextVal();
    const prefixedCode = zeroPrefixHelper.zeroPrefixCodeByLength(invoiceCode, 9);
    return `INV/${dateFormatter.formatDateToYYYYMMDD(new Date())}/${moduleTransactionEnum[moduleEnum.CLASS]}/${prefixedCode}`;

}

classTransactionService.generateFreeTransaction = async (cls, category, sessions, invoice, user) => {

    const classTransactionDTO = classTransactionService
        .generateClassTransactionDTO(cls, category, invoice, 0, classTransactionStatusEnum.DONE, null, user);

    return ClassTransaction.transaction(async trx => {

        const classTransaction = await ClassTransaction.query(trx)
            .insertToTable(classTransactionDTO, user.sub);

        const transactionDetailDTOs = classTransactionService
            .generateDetailTransactionDTOs(classTransaction, cls, category, sessions, invoice, user);
        const detailTransactions = await classTransactionDetailService
            .generateTransactionDetail(transactionDetailDTOs, user, trx);

        // Free, then just assign the user to session immediately
        const participantSessionDTOs = classTransactionDetailService.generateParticipantSessionDTOs(detailTransactions);
        await classCategoryParticipantSessionService.register(participantSessionDTOs, user, trx);

        return {
            ...classTransaction,
            details: detailTransactions,
        }

    });

}

classTransactionService.getNextTransactionSequenceVal = async () => {

    return ClassTransactionSequence.getNextVal();

}

classTransactionService.generatePaidTransaction = async (cls, category, sessions, price, invoice, expiryDate, user) => {

    return ClassTransaction.transaction(async trx => {

        const classTransactionDTO = classTransactionService
            .generateClassTransactionDTO(cls, category, invoice, price, classTransactionStatusEnum.AWAITING_PAYMENT, new Date(expiryDate).getTime(), user);

        const classTransaction = await ClassTransaction.query(trx)
            .insertToTable(classTransactionDTO, user.sub);

        const transactionDetailDTOs = classTransactionService
            .generateDetailTransactionDTOs(classTransaction, cls, category, sessions, invoice, user);
        // save transaction detail to use when the invoice is paid
        await classTransactionDetailService
            .generateTransactionDetail(transactionDetailDTOs, user, trx);

    });
}

classTransactionService.getTotalPriceAndItems = async (cls, category, sessions, user) => {

    let priceAndItems = {
        totalPrice: 0,
        items: []
    }
    let itemPrice = 0

    if (category.isRecurring) {
        itemPrice = classTransactionService.recurringPrice(category, sessions);
    } else {
        itemPrice = classTransactionService.nonRecurringPrice(sessions);
    }

    // sessions / category price (not free)
    if (itemPrice > 0) {
        priceAndItems.items.push({
            'name': 'Class Session(s)',
            'quantity': 1,
            'price': itemPrice
        });
        priceAndItems.totalPrice += itemPrice;
    }

    // Check if the registrant have registered to this class
    // If not, apply administration fee
    const isClassParticipant = await classCategoryParticipantSessionService.isUserClassParticipant(user.sub, cls.uuid);
    if (!isClassParticipant) {
        if (cls.administrationFee !== 0) {           
            priceAndItems.items.push({
                'name': 'Administration Fee',
                'quantity': 1,
                'price': cls.administrationFee
            });
            priceAndItems.totalPrice += cls.administrationFee;
        }
    }

    return priceAndItems

}

classTransactionService.processInvoice = async (invoice) => {

    const classTransaction = await ClassTransaction.query()
        .where('invoice', invoice)
        .first();

    const user = {
        sub: classTransaction.createBy
    }

    const savedDetailTransactions = await classTransactionDetailService.getTransactionDetailsByInvoice(classTransaction.invoice);

    const participantSessionDTOs = classTransactionDetailService.generateParticipantSessionDTOs(savedDetailTransactions);
    
    return ClassTransaction.transaction(async trx => {
        await classCategoryParticipantSessionService.register(participantSessionDTOs, user, trx);
    })

}

module.exports = classTransactionService;