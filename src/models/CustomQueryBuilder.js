const { QueryBuilder } = require('objection');

class CustomQueryBuilder extends QueryBuilder {

    deleteByUserId(userId) {
        const tableName = this.tableNameFor(this._modelClass)
        const patchedAttributes = {}
        //soft delete operation
        patchedAttributes[tableName.concat('deletestatus')] = true
        patchedAttributes[tableName.concat('deletetime')] = Date.now()
        patchedAttributes[tableName.concat('deleteby')] = userId
        return this.patch(patchedAttributes)
    }

    updateByUserId(patchObj, userId) {
        console.log(patchObj)
        const tableName = this.tableNameFor(this._modelClass)
        const patchedAttributes = { ...patchObj }
        //patch operation
        patchedAttributes[tableName.concat('changetime')] = Date.now()
        patchedAttributes[tableName.concat('changeby')] = userId
        return this.patch(patchedAttributes)
    }

    unDeleteByUserId(userId) {
        const tableName = this.tableNameFor(this._modelClass)
        const patchedAttributes = {}
        //patch operation
        patchedAttributes[tableName.concat('deletestatus')] = false
        patchedAttributes[tableName.concat('changetime')] = Date.now()
        patchedAttributes[tableName.concat('changeby')] = userId
        return this.patch(patchedAttributes)
    }
}

module.exports = CustomQueryBuilder