const Disbursement = require('../../models/v2/Disbursement');
const { UnsupportedOperationError } = require('../../models/errors');

disbursementService = {};

const disbursementStatusEnum = {
    PENDING: 'PENDING',
    PROCESSING: 'PROCESSING',
    WITHDRAWN: 'WITHDRAWN',
}

const errorEnum = {
    DISBURSEMENTS_NOT_FOUND: 'DISBURSEMENTS_NOT_FOUND',
    DISBURSEMENTS_INVALID_STATUS: 'DISBURSEMENTS_INVALID_STATUS',
}

disbursementService.createDisbursement = async(disbursementDTO) => {

    return Disbursement.query()
        .insertToTable(disbursementDTO, 0);

}

disbursementService.getMyDisbursementAmount = async (userId) => {

    const disbursements = await Disbursement.query()
        .where('user_id', userId);

    let totalPending = 0;
    let totalProcessing = 0;
    disbursements.forEach(disbursement => {
        const disbursementAmount = parseInt(disbursement.amount);
        if (disbursement.status === disbursementStatusEnum.PENDING) {
            totalPending += disbursementAmount;
        }
        if (disbursement.status === disbursementStatusEnum.PROCESSING) {
            totalProcessing += disbursementAmount;
        }
    })

    return {
        pendingAmount: totalPending,
        processingAmount: totalProcessing
    }

}

disbursementService.processDisbursements = async (disbursementRequestUuid, userId, trx) => {

    const disbursements = await Disbursement.query(trx)
        .where('user_id', userId)
        .andWhere('status', disbursementStatusEnum.PENDING);

    if (disbursements.length === 0) {
        throw new UnsupportedOperationError(errorEnum.DISBURSEMENTS_NOT_FOUND);
    }

    for (let i=0;i<disbursements.length;i++) {
        if (disbursements[i].status !== disbursementStatusEnum.PENDING) {
            throw new UnsupportedOperationError(errorEnum.DISBURSEMENTS_INVALID_STATUS);
        }
    }

    return Disbursement.query(trx)
        .where('user_id', userId)
        .andWhere('status', disbursementStatusEnum.PENDING)
        .updateByUserId({
            disbutsementRequestUuid: disbursementRequestUuid,
            status: disbursementStatusEnum.PROCESSING,
        }, userId);

}

disbursementService.withdrawnDisbursements = async (disbursementRequestUuid, trx) => {

    const disbursements = await Disbursement.query(trx)
        .where('disbursement_request_uuid', disbursementRequestUuid);

    if (disbursements.length === 0) {
        throw new UnsupportedOperationError(errorEnum.DISBURSEMENTS_NOT_FOUND);
    }

    for (let i=0;i<disbursements.length;i++) {
        if (disbursements[i].status !== disbursementStatusEnum.PROCESSING) {
            throw new UnsupportedOperationError(errorEnum.DISBURSEMENTS_INVALID_STATUS);
        }
    }

    return Disbursement.query(trx)
        .where('disbursement_request_uuid', disbursementRequestUuid)
        .updateByUserId({
            status: disbursementStatusEnum.WITHDRAWN,
        }, 0);

}

module.exports = disbursementService;