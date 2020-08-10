const Company = require('../models/Company');
const Address = require('../models/Address');
const User = require('../models/User');
const bcrypt = require('../helper/bcrypt');
const CompanyUserMapping = require('../models/CompanyUserMapping')
const { raw } = require('objection')
const ServiceHelper = require('../helper/ServiceHelper')

const CompanyService = {};

CompanyService.registerCompany = async(userDTO, companyDTO, addressDTO) => {

    const address = await Address.query().insert(addressDTO);

    companyDTO.eaddresseaddressid = address.eaddressid;
    companyDTO.ecompanycreateby = 0;
    const company = await Company.query().insert(companyDTO);

    // super user of the company
    userDTO.euserpermission = 10;
    userDTO.ecompanyecompanyid = company.ecompanyid;
    userDTO.euserpassword = await bcrypt.hash(userDTO.euserpassword);
    const user = await User.query().insert(userDTO);

    return {
        user: user,
        company: company,
        address: address
    }

}

CompanyService.getUsersByCompanyId = async(companyId, page, size) => {

    const pageObj = await CompanyUserMapping.query()
        .where('ecompanyecompanyid', companyId)
        .page(page, size)

    return ServiceHelper.toPageObj(page, size, pageObj)

}

CompanyService.saveUsersToCompany = async(companyId, users, loggedInUser) => {

    //accepting model [{'id': 1, 'deleted': false/true}]

    const company = await Company.query().findById(companyId)

    if(!company)
        return

    const deletedUserIds = users.filter(user => user.deleted)
        .map(user => user.id)

    const insertedUserIds = users.filter(user => !user.deleted)
        .map(user => user.id)

    const deleteRelationsQuery = CompanyUserMapping.query()
        .deleteByUserId(loggedInUser.sub)
        .where('ecompanyecompanyid', companyId)
        .whereIn('eusereuserid', deletedUserIds)

    const selectUserIdsByDeleteStatusQuery = (status) => CompanyUserMapping.query()
        .where('ecompanyusermappingdeletestatus', status)
        .where('ecompanyecompanyid', companyId)
        .whereIn('eusereuserid', insertedUserIds)

    const undoDeleteQuery = selectUserIdsByDeleteStatusQuery(true)
        .unDeleteByUserId(loggedInUser.sub)

    const filterNewUserIds = (existedIds) => {
        return insertedUserIds
            .filter(userId => !existedIds.find(id => id === userId))
            .map(userId => ({
                eusereuserid: userId,
                ecompanyecompanyid: parseInt(companyId),
                ecompanyusermappingcreateby: loggedInUser.sub
            }))
    }

    const getAllUsersDataByCompany = () => Company.relatedQuery('users')
        .for(companyId)
        .modify({ ecompanyusermappingdeletestatus: false })

    return Promise.all([deleteRelationsQuery, undoDeleteQuery])
        .then(ignored => selectUserIdsByDeleteStatusQuery(false))
        .then(existedRelations => existedRelations.map(relation => relation.eusereuserid))
        .then(existedIds => filterNewUserIds(existedIds))
        .then(freshRelations => CompanyUserMapping.query().insert(freshRelations))
        .then(ignored => getAllUsersDataByCompany())

}

CompanyService.createCompany = async(userId, companyDTO, addressDTO, user) => {

    const address = await Address.query().insert(addressDTO);

    companyDTO.eaddresseaddressid = address.eaddressid;
    companyDTO.ecompanycreateby = user.sub;
    const company = await Company.query().insert(companyDTO);

    const id = ( isNaN(userId) ) ? parseInt(user.sub) : userId

    const companyUserMapping = await CompanyUserMapping.query().insert({
        ecompanyecompanyid: company.ecompanyid,
        eusereuserid: id,
        ecompanyusermappingcreateby: user.sub
    })

    const patchDTO = isNaN(userId) ? { euserpermission: 10 } :
        {
            euserpermission: 10,
            ecompanyecompanyid: company.ecompanyid
        }


    // super user of the company
    const updateUser = await User.query()
        .findById(id)
        .updateByUserId(patchDTO, user.sub)
        .returning('*');

    return {
        user: updateUser,
        company: company,
        address: address,
        companyusermapping: companyUserMapping
    }

}

CompanyService.getCompany = async (page, size, type, keyword) => {
    const newKeyword = keyword.toLowerCase()
    let query = Company.query()
            .select()
            .where(raw('lower("ecompanyname")'), 'like', `%${newKeyword}%`)
            .andWhere('ecompanydeletestatus', false)
    if ( type === 'company')
        query.whereNull('ecompanyparentid')

    else
        query.whereNotNull('ecompanyparentid')

    const pageObj = await query.page(page, size)

    return ServiceHelper.toPageObj(page, size, pageObj)

}

async function generateJWTToken(user, companyId) {

    const config = {
        sub: user.euserid,
        iat: Date.now() / 1000.0,
        email: user.euseremail,
        name: user.eusername,
        mobileNumber: user.eusermobilenumber,
        permission: user.euserpermission,
        companyId: companyId
    }
    const token = jwt.sign(config, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1800s' });

    return token;

}

CompanyService.changeCompany = async (companyId, user) => {

    // const user = await User.query()
    const success = await bcrypt.compare(loginDTO.euserpassword, user.euserpassword);

    let token = null;

    if (success === true) {
        token = await generateJWTToken(user);
    }

    return token;
}

CompanyService.editCompany = async (companyId, companyDTO, user) => {

    return Company.query().findById(companyId).updateByUserId(companyDTO, user.sub).returning('*')
}

CompanyService.deleteCompany = async (companyId, companyDTO) => {

    return Company.query().patchAndFetchById(companyId, companyDTO)

}

module.exports = CompanyService;