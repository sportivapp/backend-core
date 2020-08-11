const companySchemas = require('./company')
const userSchemas = require('./user')

module.exports = {
    ...companySchemas,
    ...userSchemas  
}