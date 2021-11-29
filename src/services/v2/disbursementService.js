const Disbursement = require('../../models/v2/Disbursement');

disbursementService = {};

const disbursementStatusEnum = {
    PENDING: 'PENDING',
    PROCESSING: 'PROCESSING',
    WITHDRAWN: 'WITHDRAWN',
}

disbursementService.createDisbursement = async(disbursementDTO) => {

    return Disbursement.query()
        .insertToTable(disbursementDTO, 0);

}

disbursementService.getMyDisbursementAmount = async (userId) => {

    const disbursements = await Disbursement.query()
        .where('user_id', userId)
        .andWhere('status', disbursementStatusEnum.PENDING);

    let total = 0;
    disbursements.forEach(disbursement => {
        total += parseInt(disbursement.amount);
    })

    return {
        amount: total,
    }

}

module.exports = disbursementService;