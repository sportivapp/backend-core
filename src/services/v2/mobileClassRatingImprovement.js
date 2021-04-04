const ClassRatingImprovements = require('../../models/v2/ClassRatingImprovements');

const mobileClassRatingImprovementsService = {};

mobileClassRatingImprovementsService.addRatingImprovements = async(ratingImprovementDTOs, trx) => {

    return ClassRatingImprovements.query(trx)
        .insert(ratingImprovementDTOs);

}

module.exports = mobileClassRatingImprovementsService;