const { UnsupportedOperationError } = require('../../models/errors');
const DisbursementRequest = require('../../models/v2/DisbursementRequest');
const disbursementService = require('./disbursementService');
const emailService = require('../../helper/emailService');

disbursementRequestService = {};

const disbursementRequestStatusEnum = {
    PROCESSING: 'PROCESSING',
    WITHDRAWN: 'WITHDRAWN',
}

const errorEnum = {
    INVALID_DISBURSEMENT_REQUEST_STATUS: 'INVALID_DISBURSEMENT_REQUEST_STATUS',
    DISBURSEMENT_REQUEST_NOT_FOUND: 'DISBURSEMENT_REQUEST_NOT_FOUND',
}

disbursementRequestService.createDisbursementRequest = async(userId) => {

    return DisbursementRequest.transaction(async (trx) => {

        const disbursementRequest = await DisbursementRequest.query(trx)
            .insertToTable({}, userId);

        await disbursementService.processDisbursements(disbursementRequest.uuid, userId, trx);

        emailService.sendDisbursementReport(disbursementRequest.uuid);

        return disbursementRequest
    });

}

disbursementRequestService.withdrawnDisbursementRequest = async (disbursementRequestUuid) => {

    return DisbursementRequest.transaction(async (trx) => {

        const disbursementRequest = await DisbursementRequest.query(trx)
            .findById(disbursementRequestUuid);

        if (!disbursementRequest)
            throw new UnsupportedOperationError(errorEnum.DISBURSEMENT_REQUEST_NOT_FOUND);

        if (disbursementRequest.status !== disbursementRequestStatusEnum.PROCESSING) {
            throw new UnsupportedOperationError(errorEnum.INVALID_DISBURSEMENT_REQUEST_STATUS);
        }

        await DisbursementRequest.query(trx)
            .findById(disbursementRequestUuid)
            .updateByUserId({
                status: disbursementRequestStatusEnum.WITHDRAWN,
                withdrawnTime: Date.now(),
            }, 0);

        await disbursementService.withdrawnDisbursements(disbursementRequestUuid, trx);

        return {
            withdrawn: true
        };

    });

}

module.exports = disbursementRequestService;