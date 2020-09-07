const ApplyInvite = require('../models/ApplyInvite');
const CompanyUserMapping = require('../models/CompanyUserMapping');

const applyInviteService = {}

const ApplyInviteTypeEnum = {
    APPLY: 'APPLY',
    INVITE: 'INVITE'
}

const ApplyInviteStatusEnum = {
    PENDING: 'PENDING',
    ACCEPTED: 'ACCEPTED',
    REJECTED: 'REJECTED'
}

applyInviteService.getApplyInvite = async (user, type) => {

    return ApplyInvite.query()
    .select('eapplyinviteid', 'ecompanyid', 'ecompanyname', 'eindustryname', 'efileefileid')
    .leftJoinRelated('company.[file, industry]')
    .where('eusereuserid', user.sub)
    .andWhere('eapplyinvitetype', type)
    .andWhere('eapplyinvitestatus', ApplyInviteStatusEnum.PENDING);

}

applyInviteService.joinRequest = async (companyId, user) => {

    const applyPending = await ApplyInvite.query()
    .where('eusereuserid', user.sub)
    .andWhere('ecompanyecompanyid', companyId)
    .andWhere('eapplyinvitetype', ApplyInviteTypeEnum.APPLY)
    .andWhere('eapplyinvitestatus', ApplyInviteStatusEnum.PENDING)
    .first();

    if (applyPending)
        return

    return ApplyInvite.query().insertToTable({
        ecompanyecompanyid: companyId,
        eusereuserid: user.sub,
        eapplyinvitetype: ApplyInviteTypeEnum.APPLY
    }, user.sub);

}

applyInviteService.cancelJoinRequest = async (companyId, user) => {

    const applyPending = await ApplyInvite.query()
    .where('eusereuserid', user.sub)
    .andWhere('ecompanyecompanyid', companyId)
    .andWhere('eapplyinvitetype', ApplyInviteTypeEnum.APPLY)
    .andWhere('eapplyinvitestatus', ApplyInviteStatusEnum.PENDING)
    .first();

    if (!applyPending)
        return
    
    return applyPending.$query().delete();
    
}

applyInviteService.processInvitation = async (companyId, user, status) => {

    if (!ApplyInviteStatusEnum.hasOwnProperty(status))
        return

    const invitePending = await ApplyInvite.query()
    .where('eusereuserid', user.sub)
    .andWhere('ecompanyecompanyid', companyId)
    .andWhere('eapplyinvitetype', ApplyInviteTypeEnum.INVITE)
    .andWhere('eapplyinvitestatus', ApplyInviteStatusEnum.PENDING)
    .first();

    if (!invitePending)
        return
    
    if (status === ApplyInviteStatusEnum.ACCEPTED) {
        await CompanyUserMapping.query().insertToTable({
            ecompanyecompanyid: invitePending.ecompanyecompanyid,
            eusereuserid: invitePending.eusereuserid,
            ecompanyusermappingpermission: 1
        }, invitePending.eapplyinvitecreateby);
    }

    return invitePending.$query().updateByUserId({
        eapplyinvitestatus: status
    }, user.sub);

}

module.exports = applyInviteService;