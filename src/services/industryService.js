const Industry = require('../models/Industry')
const User = require('../models/User')
const UserIndustryMapping = require('../models/UserIndustryMapping')
const CoachIndustryMapping = require('../models/CoachIndustryMapping')
const { raw } = require('objection')
const { UnsupportedOperationError, NotFoundError } = require('../models/errors')

const industryService = {}

const UnsupportedOperationErrorEnum = {
    NOT_ADMIN: 'NOT_ADMIN',
    USER_NOT_EXIST: 'USER_NOT_EXIST',
    INDUSTRY_IS_EMPTY: 'INDUSTRY_IS_EMPTY',
}

industryService.getUserById = async (userId) => {

    const user = await User.query()
    .select('euserid', 'eusername', 'eusermobilenumber', 'euseremail', 'euseridentitynumber', 'euserdob', 'euseraddress', 'eusergender', 
    'euserhobby', 'euserfacebook', 'euserinstagram', 'euserlinkedin', 'ecountryname', 'efileefileid', 'euseriscoach')
    .leftJoinRelated('country')
    .where('euserid', userId).first();

    if (!user)
        return

    return user;
    
}

industryService.getIndustryList = async (keyword) => {

    let newKeyword = ''

    if (keyword) newKeyword = keyword.toLowerCase()

    return Industry.query()
        .select('eindustryid', 'eindustryname')
        .where(raw('lower("eindustryname")'), 'like', `%${newKeyword}%`)
}

industryService.changeIndustryByUserId = async (user, type, industryIds) => {

    const userFromDB = await industryService.getUserById(user.sub)

    if(!userFromDB)
        return UnsupportedOperationError(UnsupportedOperationErrorEnum.USER_NOT_EXIST)

    if(industryIds.length <= 0) 
        return UnsupportedOperationError(UnsupportedOperationErrorEnum.INDUSTRY_IS_EMPTY)

    const mapping = industryIds.map(industryId => ({
        eusereuserid: user.sub,
        eindustryeindustryid: industryId
    }))

    if(type === 'USER') {

        return UserIndustryMapping.query()
            .delete()
            .where('eusereuserid', user.sub)
            .then(ignore => {
                    return UserIndustryMapping.query()
                    .insertToTable(mapping, user.sub)
                })

    } else if ( type === 'COACH') {

        return CoachIndustryMapping.query()
            .delete()
            .where('eusereuserid', user.sub)
            .then(ignore => {
                    return CoachIndustryMapping.query()
                    .insertToTable(mapping, user.sub)
                })
    }

}

module.exports = industryService