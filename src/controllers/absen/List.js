const ResponseHelper = require('../../helper/ResponseHelper')
const absenService = require('../../services/absenService');

module.exports = async (req, res, next) => {
    
    const user = req.user;

    if (user.permission !== 1) {
        return res.status(401).json({
            data: 'You cannot view list absen'
        })
    }

    try {

        const result = await absenService.listAbsen();

        if (!result)
            return res.status(400).json(ResponseHelper.toErrorResponse(400))
        return res.status(200).json(ResponseHelper.toBaseResponse(result))
        
    } catch (e) {
        next(e);
    }
}