const { QueryBuilder } = require('objection');

class CustomQueryBuilder extends QueryBuilder {

    insertToTable(data, userId) {
        const tableName = this.tableNameFor(this._modelClass)
        if (!userId) userId = 0
        if (data.length) {
            const addedDataList = data.map(obj => {
                obj[tableName.concat('createtime')] = Date.now()
                obj[tableName.concat('createby')] = userId
                return obj
            })
            return this.insert(addedDataList)
        } else {
            const addedData = { ...data }
            addedData[tableName.concat('createtime')] = Date.now()
            addedData[tableName.concat('createby')] = userId
            return this.insert(addedData)
        }
    }

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