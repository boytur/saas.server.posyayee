const jwt = require('jsonwebtoken');
const userDecode = (req) => {
    try {
        if (!req) { return; }
        const userTokenCookies = req.cookies.access_token
        if (!userTokenCookies) {
            return;
        }
        const decoded = jwt.decode(userTokenCookies);
        const userData = decoded;
        return userData;
    }
    catch (err) {
        console.error("Err while decode user: ", err);
    }
}

module.exports = userDecode;