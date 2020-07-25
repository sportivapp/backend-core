const projectService = require('../../services/projectService');

module.exports = async (req, res, next) => {

    try {

        const user = req.user;

        if (user.permission !== 9) {
            return res.status(401).json({
                data: 'You cannot view project'
            })
        }

        const userId = user.sub;
        const projects = await projectService.getProjects(userId);

        return res.status(200).json({
            data: projects
        });

    } catch(e) {
        next(e);
    }

}