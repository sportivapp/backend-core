const templatePath = require('../../../templates/index');

module.exports = async (req, res, next) => {

    try {

        res.setHeader('Content-disposition', 'attachment; filename=Import Data Karyawan Template.xlsx');
        res.setHeader('Content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        return res.download(templatePath);

    } catch(e) {
        next(e);
    }

}