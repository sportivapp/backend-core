const projectService = require('../../services/projectService');

module.exports = async (req, res, next) => {

    try {

        const user = req.user;

        if (user.permission !== 9) {
            return res.status(401).json({
                data: 'You cannot edit project'
            })
        }

        const { projectId } = req.params;
        const { code, name, startDate, endDate, address } = req.body;
        const projectDTO = { 
            eprojectcode: code, 
            eprojectname: name,
            eprojectstartdate: startDate, 
            eprojectenddate: endDate, 
            eprojectcreateby: user.sub,
            eprojectaddress: address
        }

        console.log(projectId);
        console.log(projectDTO);

        const project = await projectService.editProject(projectId, projectDTO);

        return res.status(200).json({
            data: project
        });

    } catch(e) {
        next(e);
    }

}