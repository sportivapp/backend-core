const ClassCategoryPriceLog = require('../../models/v2/ClassCategoryPriceLog');

classCategoryPriceLog = {};

classCategoryPriceLog.addPriceLog = async (priceLogDTO, user, trx) => {

    return ClassCategoryPriceLog.query(trx)
        .insertToTable(priceLogDTO, user.sub);
    
}

module.exports = classCategoryPriceLog;