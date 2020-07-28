const projectService = require('../../services/projectService');

module.exports = async (req, res, next) => {

    try {

        const user = req.user;

        if (user.permission !== 8) {
            return res.status(401).json({
                data: 'You cannot delete project'
            })
        }

        const { projectId } = req.params;

        const project = await projectService.deleteProject(projectId);

        return res.status(200).json({
            data: project
        });

    } catch(e) {
        next(e);
    }

}