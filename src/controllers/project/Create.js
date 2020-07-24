const projectService = require('../../services/projectService');

module.exports = async (req, res, next) => {

    try {

        const { code, name, startDate, endDate } = req.body;
        const user = req.user;

        if (user.permission !== 9) {
            return res.status(401).json({
                data: 'You cannot create project'
            })
        }

        const projectDTO = { 
            eprojectcode: code, 
            eprojectname: name,
            eprojectstartdate: startDate, 
            eprojectenddate: endDate, 
            eprojectcreateby: user.sub
        }

        const project = await projectService.createProject(projectDTO);

        return res.status(200).json({
            data: project
        });

    } catch(e) {
        next(e);
    }

}