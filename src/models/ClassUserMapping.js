 const Model = require('./Model');

 class ClassUserMapping extends Model {
     static get tableName() {
         return 'eclassusermapping';
     };

     static get idColumn() {
         return 'eclassusermappingid'
     };

     static get jsonSchema() {
         return {
             type: 'object',
             required: [],
             properties: {

             }
         };
     }

     static get relationMappings() {

        const User = require('./User')
        const Class = require('./Class')

        return {
            user: {
                modelClass: User,
                relation: Model.BelongsToOneRelation,
                join: {
                    from: 'eclassusermapping.euseruserid',
                    to: 'euser.euserid'
                }
            },
            class: {
                relation: Model.BelongsToOneRelation,
                modelClass: Class,
                from: 'eclassusermapping.eclasseclassid',
                to: 'eclass.eclassid'

            }
        
        }

     }
 }

 module.exports = ClassUserMapping;