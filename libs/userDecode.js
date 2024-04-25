const jwt = require('jsonwebtoken');
const userDecode = (req) => {
    if (!req) {return;}
    const userTokenCookies = req.cookies.access_token
    if (!userTokenCookies) {
        return;
    }
    const decoded = jwt.decode(userTokenCookies);
    const userData = decoded;
    return userData;
}

module.exports = userDecode;