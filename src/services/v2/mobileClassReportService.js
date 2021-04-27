const ClassReport = require('../../models/v2/ClassReport');
const classReportEnum = require('../../models/enum/ClassReportEnum');
const { UnsupportedOperationError } = require('../../models/errors');
const emailService = require('../../helper/emailService');

const ErrorEnum = {
    INVALID_CODE: 'INVALID_CODE',
}

const classReportService = {};

classReportService.reportClass = async (cls, classReportDTO, user) => {

    if (!classReportEnum[classReportDTO.code])
        throw new UnsupportedOperationError(ErrorEnum.INVALID_CODE);

    classReportDTO.codeName = classReportEnum[classReportDTO.code];

    const classReport = await ClassReport.query()
        .insertToTable(classReportDTO, user.sub);

    const callback = (error, _) => {
        if (error) {
            classReport = ClassReport.query()
                .findById(classReport.uuid)
                .updateByUserId({ sentStatus: false }, 0)
        }
    }

    emailService.sendClassReport(cls, classReport, user, callback)

    return classReport;
    
}

module.exports = classReportService;