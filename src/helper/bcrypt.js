const bcrypt = require('bcryptjs')

const saltRounds = 10

exports.hash = async str => {

    return await bcrypt.hash(str, saltRounds);

};

exports.compare = async (plain, encrypted) => {

    return await bcrypt.compare(plain, encrypted);

}