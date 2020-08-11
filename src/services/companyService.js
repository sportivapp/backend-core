const Company = require('../models/Company');
const Address = require('../models/Address');
const User = require('../models/User');
const bcrypt = require('../helper/bcrypt');
const CompanyUserMapping = require('../models/CompanyUserMapping')
const { raw } = require('objection')
const jwt = require('jsonwebtoken')
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

CompanyService.getAllCompanyByUserId = async(userId) => {

    const result = await User.relatedQuery('companies')
    .for(userId)
    .modify({ ecompanyusermappingdeletestatus: false })
    .where('ecompanyparentid', null)
    .orderBy('ecompanyusermappingcreatetime', 'ASC')

    return result

}

CompanyService.saveUsersToCompany = async(companyId, users, loggedInUser) => {

    //accepting model [{'id': 1, 'deleted': false/true, 'permission': 10}]

    const company = await Company.query().findById(companyId)

    if(!company)
        return

    let deleteRelationPromises = []

    let unDeleteRelationPromises = []

    const deletedUsers = users.filter(user => user.deleted)

    const insertedUsers = users.filter(user => !user.deleted)

    const filterRelationsByIdAndPermission = (relation, user) => {
        return user.id === relation.eusereuserid && user.permission === relation.ecompanyusermappingpermission
    }

    const deleteRelation = (userId, permission) => CompanyUserMapping.query()
        .where('eusereuserid', userId)
        .where('ecompanyusermappingpermission', permission)
        .deleteByUserId(loggedInUser.sub)

    const unDeleteRelation = (userId, permission) => CompanyUserMapping.query()
        .where('eusereuserid', userId)
        .where('ecompanyusermappingpermission', permission)
        .unDeleteByUserId(loggedInUser.sub)

    const selectRelationsByDeleteStatusQuery = (status) => CompanyUserMapping.query()
        .where('ecompanyusermappingdeletestatus', status)
        .where('ecompanyecompanyid', companyId)
        .whereIn('eusereuserid', insertedUsers.map(user => user.id))

    const selectDeleteRelations = CompanyUserMapping.query()
        .where('ecompanyecompanyid', companyId)
        .whereIn('eusereuserid', deletedUsers.map(user => user.id))
        .then(relations => {
            relations
                .filter(relation => !!deletedUsers.find(user => filterRelationsByIdAndPermission(relation, user)))
                .forEach(relation => deleteRelationPromises.push(deleteRelation(relation.eusereuserid, relation.ecompanyusermappingpermission)))
            return deleteRelationPromises
        })

    const selectUnDeletedRelations = selectRelationsByDeleteStatusQuery(true)
        .then(relations => {
            relations
                .filter(relation => !!insertedUsers.find(user => filterRelationsByIdAndPermission(relation, user)))
                .forEach(relation => unDeleteRelationPromises.push(unDeleteRelation(relation.eusereuserid, relation.ecompanyusermappingpermission)))
            return unDeleteRelationPromises
        })

    const filterNewUserIds = (existedRelations) => {
        return insertedUsers
            .filter(user => !existedRelations.find(relation => filterRelationsByIdAndPermission(relation, user)))
            .map(user => ({
                eusereuserid: user.id,
                ecompanyecompanyid: parseInt(companyId),
                ecompanyusermappingcreateby: loggedInUser.sub,
                ecompanyusermappingpermission: user.permission
            }))
    }

    const getAllUsersDataByCompany = Company.relatedQuery('users')
        .for(companyId)
        .modify({ ecompanyusermappingdeletestatus: false })

    return Promise.all([selectDeleteRelations, selectUnDeletedRelations])
        .then(arrayOfPromises => Promise.all([...arrayOfPromises[0], ...arrayOfPromises[1]]))
        .then(ignored => selectRelationsByDeleteStatusQuery(false))
        .then(existedIds => filterNewUserIds(existedIds))
        .then(freshRelations => CompanyUserMapping.query().insert(freshRelations))
        .then(ignored => getAllUsersDataByCompany)

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
        ecompanyusermappingcreateby: user.sub,
        ecompanyusermappingpermission: 10
    })

    return {
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

async function generateJWTToken(user, companyId, userPermission) {

    const config = {
        sub: user.euserid,
        iat: Date.now() / 1000.0,
        email: user.euseremail,
        name: user.eusername,
        mobileNumber: user.eusermobilenumber,
        permission: userPermission,
        companyId: companyId
    }
    const token = jwt.sign(config, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1800s' });

    return token;

}

CompanyService.changeCompany = async (companyId, user) => {

    const userCompany = await CompanyUserMapping.query().select()
    .where('ecompanyecompanyid', companyId)
    .andWhere('eusereuserid', user.sub)
    .first() 

    if(!userCompany)
        return

    let token = null;
    token = await generateJWTToken(user, companyId, userCompany.ecompanyusermappingpermission);

    return token;
}

CompanyService.editCompany = async (companyId, companyDTO, user) => {

    return Company.query().findById(companyId).updateByUserId(companyDTO, user.sub).returning('*')
}

CompanyService.deleteCompany = async (companyId, companyDTO) => {

    return Company.query().patchAndFetchById(companyId, companyDTO)

}

module.exports = CompanyService;