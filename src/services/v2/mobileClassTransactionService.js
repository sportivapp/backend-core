const ClassTransaction = require('../../models/v2/ClassTransaction');
const ClassTransactionSequence = require('../../models/v2/ClassTransactionSequence');
const { moduleTransactionEnum, moduleEnum } = require('../../models/enum/ModuleTransactionEnum');
const classTransactionStatusEnum = require('../../models/enum/ClassTransactionStatusEnum');
const classCategoryParticipantSessionService = require('./mobileClassCategoryParticipantSessionService');
const classTransactionDetailService = require('./mobileClassTransactionDetailService');

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
            paidStartDate: session.startDate,
            paidEndDate: session.endDate,
            classTransactionUuid: classTransaction.uuid,
            invoice: invoice,
        };
    });

}

classTransactionService.generateClassTransactionDTO = (cls, category, invoice, invoiceCode, amount, status, user) => {

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

    const now = new Date();
    const invoiceCode = await ClassTransactionSequence.getNextVal();
    const invoice = `INV/${now.getFullYear()}${now.getMonth()+1}${now.getDate()}/${moduleTransactionEnum[moduleEnum.CLASS]}/${invoiceCode}`;

    const classTransactionDTO = classTransactionService
        .generateClassTransactionDTO(cls, category, invoice, invoiceCode, 0, classTransactionStatusEnum.DONE, user);

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

classTransactionService.generatePaidTransaction = async (cls, category, sessions, user) => {

    let price = 0;
    if (category.isRecurring)
        price = classTransactionService.recurringPrice(sessions);

    const classTransactionDTO = classTransactionService
        .generateClassTransactionDTO(cls, category, null, null, price, classTransactionStatusEnum.ONGOING, user);

    return ClassTransaction.transaction(async trx => {

        const classTransaction = await ClassTransaction.query(trx)
            .insertToTable(classTransactionDTO, user.sub);

        const transactionDetailDTOs = classTransactionService
            .generateDetailTransactionDTOs(classTransaction, cls, category, sessions, null, user);
        await classTransactionDetailService
            .generateTransactionDetail(transactionDetailDTOs, user, trx);

        return {
            ...classTransaction,
            details: detailTransactions,
        }

    });
        
        
}

module.exports = classTransactionService;