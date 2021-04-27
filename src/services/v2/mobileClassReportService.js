const ClassReport = require('../../models/v2/ClassReport');
const classReportEnum = require('../../models/enum/ClassReportEnum');
const { UnsupportedOperationError } = require('../../models/errors');

const ErrorEnum = {
    INVALID_CODE: 'INVALID_CODE',
}

const classReportService = {};

classReportService.reportClass = async (classReportDTO, user) => {

    if (!classReportEnum[classReportDTO.code])
        throw new UnsupportedOperationError(ErrorEnum.INVALID_CODE);

    classReportDTO.codeName = classReportEnum[classReportDTO.code];

    return ClassReport.query()
        .insertToTable(classReportDTO, user.sub);
    
}

module.exports = classReportService;