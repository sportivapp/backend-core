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
const paymentDetailTemplateHelper = require('../../helper/paymentDetailTemplateHelper');

const ErrorEnum = {
    INVALID_PAYMENT_CHANNEL_CODE: 'INVALID_PAYMENT_CHANNEL_CODE',
}

const transactionStatusEnum = {
    AWAITING_PAYMENT: "AWAITING_PAYMENT",
    DONE: "DONE",
    PROCESSED: "PROCESSED",
    CANCELLED: "CANCELLED",
}

const classTransactionService = {};

const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

classTransactionService.processRecurring = (category, sessions) => {

    let itemDetails = [];

    const sevenHours = 7 * 60 * 60 * 1000;

    const foundMonth = {};
    sessions.forEach(session => {

        const wibTime = new Date(parseInt(session.startDate) + sevenHours);
        const sessionMonth = wibTime.getMonth();

        if (!foundMonth[sessionMonth]) {
            const sessionYear = wibTime.getFullYear();
            foundMonth[sessionMonth] = true;
            const paymentDetailTemplate = paymentDetailTemplateHelper.itemDetailTemplate = {
                name: monthNames[sessionMonth] + ' ' + sessionYear,
                price: parseInt(category.price),
                quantity: 1
            };
            itemDetails.push(paymentDetailTemplate);
        }
    });

    return {
        itemDetails: itemDetails,
        price: parseInt(category.price) * itemDetails.length
    }

}

classTransactionService.formatTime = (timeInt) => {

    // timeInt => hour / minute / second
    if (timeInt < 10) {
        return '0' + timeInt;
    }

    return timeInt.toString();

}

classTransactionService.processNonRecurring = (sessions) => {

    let itemDetails = [];
    let price = 0;

    const sevenHours = 7 * 60 * 60 * 1000;

    sessions.forEach(session => {
        const sessionPriceInt = parseInt(session.price);
        const startWibDate = new Date(parseInt(session.startDate) + sevenHours);
        const sessionDate = startWibDate.getDate();
        const sessionMonth = startWibDate.getMonth();
        const sessionYear = startWibDate.getFullYear();
        const endWibDate = new Date(parseInt(session.endDate) + sevenHours);

        let startHourString = classTransactionService.formatTime(startWibDate.getHours());
        let startMinuteString = classTransactionService.formatTime(startWibDate.getMinutes());
        let endHourString = classTransactionService.formatTime(endWibDate.getHours());
        let endMinuteString = classTransactionService.formatTime(endWibDate.getMinutes());

        price += sessionPriceInt;
        const paymentDetailTemplate = paymentDetailTemplateHelper.itemDetailTemplate = {
            name: sessionDate + ' ' + monthNames[sessionMonth] + ' ' + sessionYear,
            description: startHourString + ':' + startMinuteString + ' - ' + endHourString + ':' + endMinuteString,
            quantity: 1,
            price: sessionPriceInt
        }
        itemDetails.push(paymentDetailTemplate);
    });

    return {
        itemDetails: itemDetails,
        price: price
    }

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

classTransactionService.processItems = async (cls, category, sessions, user) => {

    const paymentDetailTemplate = paymentDetailTemplateHelper.paymentDetailTemplate;
    paymentDetailTemplate.payment = {
        subtotal: 0,
        adminFee: 0,
        promo: 0
    }

    paymentDetailTemplate.itemHeader = {
        type: 'Class',
        title: cls.title,
        subtitle: category.title,
        sportType: cls.industry.eindustryname,
        city: cls.city.ecityname,
        file: {
            name: cls.classMedia[0].file.efilename,
            type: cls.classMedia[0].file.efiletype
        }
    }
    let itemDetailsAndPrice = {
        itemDetails: [paymentDetailTemplateHelper.itemDetailTemplate],
        price: 0
    };

    if (category.isRecurring) {
        itemDetailsAndPrice = classTransactionService.processRecurring(category, sessions);
    } else {
        itemDetailsAndPrice = classTransactionService.processNonRecurring(sessions);
    }

    // sessions / category price (not free)
    if (itemDetailsAndPrice.price > 0) {
        paymentDetailTemplate.payment.subtotal += itemDetailsAndPrice.price;
    }

    // Check if the registrant have registered to this class
    // If not, apply administration fee
    const isClassParticipant = await classCategoryParticipantSessionService.isUserClassParticipant(user.sub, cls.uuid);
    if (!isClassParticipant) {
        if (cls.administrationFee !== 0) {
            paymentDetailTemplate.payment.adminFee = parseInt(cls.administrationFee);
        }
    }

    paymentDetailTemplate.itemDetails = itemDetailsAndPrice.itemDetails;

    return paymentDetailTemplate

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
        await ClassTransaction.query()
            .updateByUserId({
                status: transactionStatusEnum.DONE,
            }, 0);
    })

}

module.exports = classTransactionService;