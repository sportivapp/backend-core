exports.up = function(knex) {
    let promises = []
    promises.push(updateState(knex, false))
    promises.push(updateDepartment(knex, false))
    promises.push(updateApproval(knex, false))
    promises.push(updateAnnouncementUserMapping(knex, false))
    promises.push(updateApprovalPositionMapping(knex, false))
    promises.push(updateCompanyModuleMapping(knex, false))
    promises.push(updatePermitApprovalMapping(knex, false))
  return Promise.all(promises)
};

exports.down = function(knex) {
    let promises = []
    promises.push(updateState(knex, true))
    promises.push(updateDepartment(knex, true))
    promises.push(updateApproval(knex, true))
    promises.push(updateAnnouncementUserMapping(knex, true))
    promises.push(updateApprovalPositionMapping(knex, true))
    promises.push(updateCompanyModuleMapping(knex, true))
    promises.push(updatePermitApprovalMapping(knex, true))
    return Promise.all(promises)
};

function updateState (knex, isRollback) {
    if (isRollback)
        return knex.schema.alterTable('estate', t => {
            t.dropForeign('ecountryecountryid');
            t.foreign('ecountryecountryid').references('ecountry.ecountryid')
        })
    return knex.schema.alterTable('estate', t => {
        t.dropForeign('ecountryecountryid');
        t.foreign('ecountryecountryid').references('ecountry.ecountryid').onDelete('CASCADE')
    })
}

function updateDepartment (knex, isRollback) {
    if (isRollback)
        return knex.schema.alterTable('edepartment', t => {
            t.dropForeign('edepartmentsuperiorid');
            t.foreign('edepartmentsuperiorid').references('edepartment.edepartmentid')
        })
    return knex.schema.alterTable('edepartment', t => {
        t.dropForeign('edepartmentsuperiorid');
        t.foreign('edepartmentsuperiorid').references('edepartment.edepartmentid').onDelete('CASCADE')
    })
}

function updateAnnouncementUserMapping (knex, isRollback) {
    if (isRollback)
        return knex.schema.alterTable('eannouncementusermapping', t => {
            t.dropForeign('eusereuserid');
            t.foreign('eusereuserid').references('euser.euserid')
        })
    return knex.schema.alterTable('eannouncementusermapping', t => {
        t.dropForeign('eusereuserid');
        t.foreign('eusereuserid').references('euser.euserid').onDelete('CASCADE')
    })
}

function updateCompanyModuleMapping (knex, isRollback) {
    if (isRollback)
        return knex.schema.alterTable('ecompanymodulemapping', t => {
            t.dropForeign('ecompanyecompanyid');
            t.foreign('ecompanyecompanyid').references('ecompany.ecompanyid')
            t.dropForeign('emoduleemoduleid');
            t.foreign('emoduleemoduleid').references('emodule.emoduleid')
        })
    return knex.schema.alterTable('ecompanymodulemapping', t => {
        t.dropForeign('ecompanyecompanyid');
        t.foreign('ecompanyecompanyid').references('ecompany.ecompanyid').onDelete('CASCADE')
        t.dropForeign('emoduleemoduleid');
        t.foreign('emoduleemoduleid').references('emodule.emoduleid').onDelete('CASCADE')
    })
}

function updatePermitApprovalMapping (knex, isRollback) {
    if (isRollback)
        return knex.schema.alterTable('epermitapprovalmapping', t => {
            t.dropForeign('eusereuserid');
            t.foreign('eusereuserid').references('euser.euserid')
            t.dropForeign('epermitepermitid');
            t.foreign('epermitepermitid').references('epermit.epermitid')
        })
    return knex.schema.alterTable('epermitapprovalmapping', t => {
        t.dropForeign('eusereuserid');
        t.foreign('eusereuserid').references('euser.euserid').onDelete('CASCADE')
        t.dropForeign('epermitepermitid');
        t.foreign('epermitepermitid').references('epermit.epermitid').onDelete('CASCADE')
    })
}

function updateApproval (knex, isRollback) {
    if (isRollback)
        return knex.schema.alterTable('eapproval', t => {
            t.dropForeign('etargetuserid');
            t.foreign('etargetuserid').references('euser.euserid')
            t.dropForeign('ecompanyecompanyid');
            t.foreign('ecompanyecompanyid').references('ecompany.ecompanyid')
            t.dropForeign('edepartmentedepartmentid');
            t.foreign('edepartmentedepartmentid').references('edepartment.edepartmentid')
        })
    return knex.schema.alterTable('eapproval', t => {
        t.dropForeign('etargetuserid');
        t.foreign('etargetuserid').references('euser.euserid').onDelete('CASCADE')
        t.dropForeign('ecompanyecompanyid');
        t.foreign('ecompanyecompanyid').references('ecompany.ecompanyid').onDelete('CASCADE')
        t.dropForeign('edepartmentedepartmentid');
        t.foreign('edepartmentedepartmentid').references('edepartment.edepartmentid').onDelete('CASCADE')
    })
}

function updateApprovalPositionMapping (knex, isRollback) {
    if (isRollback)
        return knex.schema.alterTable('eapprovaluser', t => {
            t.dropForeign('eusereuserid');
            t.foreign('eusereuserid').references('euser.euserid')
            t.dropForeign('eapprovaleapprovalid');
            t.foreign('eapprovaleapprovalid').references('eapproval.eapprovalid')
        })
    return knex.schema.alterTable('eapprovaluser', t => {
        t.dropForeign('eusereuserid');
        t.foreign('eusereuserid').references('euser.euserid').onDelete('CASCADE')
        t.dropForeign('eapprovaleapprovalid');
        t.foreign('eapprovaleapprovalid').references('eapproval.eapprovalid').onDelete('CASCADE')
    })
}
