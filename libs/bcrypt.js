const bcrypt = require('bcrypt');
const util = require('util');
const saltRounds = 10;
const hashAsync = util.promisify(bcrypt.hash);
const compareAsync = util.promisify(bcrypt.compare);

const bcryptHash = async (password) => {
    if (!password) return;
    const hashPassword = await hashAsync(password, saltRounds);
    return hashPassword;
}

const bcryptCompare = async (password, hashedPassword) => {
    if (!password || !hashedPassword) return false;
    const match = await compareAsync(password, hashedPassword);
    return match;
}

module.exports = {bcryptCompare,bcryptHash}