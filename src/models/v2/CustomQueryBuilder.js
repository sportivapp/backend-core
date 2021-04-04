const { QueryBuilder } = require('objection');

class CustomQueryBuilder extends QueryBuilder {

    insertToTable(data, userId) {
        if (!userId) userId = 0
        if (data.length) {
            const addedDataList = data.map(obj => {
                obj['createTime'] = Date.now()
                obj['createBy'] = userId
                obj['changeTime'] = Date.now()
                obj['changeBy'] = userId
                return obj
            })
            return this.insert(addedDataList)
        } else {
            const addedData = { ...data }
            addedData['createTime'] = Date.now()
            addedData['createBy'] = userId
            addedData['changeTime'] = Date.now()
            addedData['changeBy'] = userId
            return this.insert(addedData)
        }
    }

    softDelete() {
        const patchedAttributes = {}
        //soft delete operation
        patchedAttributes['deleteTime'] = Date.now()
        return this.patch(patchedAttributes)
    }

    updateByUserId(patchObj, userId) {
        const patchedAttributes = { ...patchObj }
        //patch operation
        patchedAttributes['changeTime'] = Date.now()
        patchedAttributes['changeBy'] = userId
        return this.patch(patchedAttributes)
    }

    unDelete() {
        const patchedAttributes = {}
        //patch operation
        patchedAttributes['deleteTime'] = null;
        return this.patch(patchedAttributes)
    }
}

module.exports = CustomQueryBuilder;