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

    return category.price * months.length;

}

classTransactionService.nonRecurringPrice = (sessions) => {

    return sessions.reduce((acc, curr) => {
        return acc.price + curr.price;
    });

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

classTransactionService.generateClassTransactionDTO = (cls, category, invoice, invoiceCode, amount, status, timeLimit, user) => {

    return {
        invoice: invoice,
        invoiceCode: invoiceCode,
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

classTransactionService.generateParticipantSessionDTOs = (detailTransactions) => {

    return detailTransactions.map(detailTransaction => {
        return {
            classUuid: detailTransaction.classUuid,
            classCategoryUuid: detailTransaction.classCategoryUuid,
            classCategorySessionUuid: detailTransaction.classCategorySessionUuid,
            userId: detailTransaction.userId,
            classTitle: detailTransaction.classTitle,
            categoryTitle: detailTransaction.categoryTitle,
            userName: detailTransaction.userName,
            classTransactionDetailUuid: detailTransaction.uuid,
        }
    });

}

classTransactionService.generateFreeTransaction = async (cls, category, sessions, user) => {

    const invoiceCode = await ClassTransactionSequence.getNextVal();
    const prefixedCode = zeroPrefixHelper.zeroPrefixCodeByLength(invoiceCode, 9);
    const invoice = `INV/${dateFormatter.formatDateToYYYYMMDD(new Date())}/${moduleTransactionEnum[moduleEnum.CLASS]}/${prefixedCode}`;

    const classTransactionDTO = classTransactionService
        .generateClassTransactionDTO(cls, category, invoice, invoiceCode, 0, classTransactionStatusEnum.DONE, null, user);

    return ClassTransaction.transaction(async trx => {

        const classTransaction = await ClassTransaction.query(trx)
            .insertToTable(classTransactionDTO, user.sub);

        const transactionDetailDTOs = classTransactionService
            .generateDetailTransactionDTOs(classTransaction, cls, category, sessions, invoice, user);
        const detailTransactions = await classTransactionDetailService
            .generateTransactionDetail(transactionDetailDTOs, user, trx);

        // Free, then just assign the user to session immediately
        const participantSessionDTOs = classTransactionService.generateParticipantSessionDTOs(detailTransactions);
        await classCategoryParticipantSessionService.register(participantSessionDTOs, user, trx);

        return {
            ...classTransaction,
            details: detailTransactions,
        }

    });

}

classTransactionService.generatePaidTransaction = async (cls, category, sessions, price, user) => {

    const invoiceCode = await ClassTransactionSequence.getNextVal();
    const prefixedCode = zeroPrefixHelper.zeroPrefixCodeByLength(invoiceCode, 9);
    const invoice = `INV/${dateFormatter.formatDateToYYYYMMDD(new Date())}/${moduleTransactionEnum[moduleEnum.CLASS]}/${prefixedCode}`;

    const timeLimit = new Date();
    timeLimit.setMinutes(timeLimit.getMinutes() + 15);

    const classTransactionDTO = classTransactionService
        .generateClassTransactionDTO(cls, category, invoice, invoiceCode, price, classTransactionStatusEnum.AWAITING_PAYMENT, timeLimit.getTime(), user);

    return ClassTransaction.transaction(async trx => {

        const classTransaction = await ClassTransaction.query(trx)
            .insertToTable(classTransactionDTO, user.sub);

        const transactionDetailDTOs = classTransactionService
            .generateDetailTransactionDTOs(classTransaction, cls, category, sessions, null, user);
        const detailTransactions = await classTransactionDetailService
            .generateTransactionDetail(transactionDetailDTOs, user, trx);

        const paymentChannel = 1;
        //UNCOMMENT IF PAYMENT SEPARATED
        // const callResult = await outboundPaymentService.createDOKUPayment(invoice, price, user.name,
        //     user.email, paymentChannel, timeLimit.getTime());
        // if (!callResult) throw new UnsupportedOperationError('FAILED_PAYMENT');
        let callResult = await dokuService.generatePaymentParams(invoice, price, user.name,
            user.email, paymentChannel, timeLimit.getTime());

        return callResult;
        // ...classTransaction,
        // details: detailTransactions,

    });
  
}

classTransactionService.generateTransaction = async (cls, category, sessions, user) => {

    let price = 0;
    if (category.isRecurring) {
        price = classTransactionService.recurringPrice(category, sessions);
    } else {
        price = classTransactionService.nonRecurringPrice(sessions);
    }

    if (price > 0) {
        return classTransactionService.generatePaidTransaction(cls, category, sessions, price, user);
    } else {
        return classTransactionService.generateFreeTransaction(cls, category, sessions, user);
    }

}

module.exports = classTransactionService;