const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const Store = require('../../models/Store');
const Package = require('../../models/Package');
const Setting = require('../../models/Setting');
const userDecode = require('../../libs/userDecode');

const Refresh = async (req, res) => {
    try {
        const refreshToken = req.cookies.refresh_token;

        if (!refreshToken) {
            return handleRefreshTokenError(res, 'Refresh token not available for this application.', 403);
        }

        const secret = process.env.JWT_REFRESH;
        let verify;
        try {
            verify = jwt.verify(refreshToken, secret);
        } catch (err) {
            return handleRefreshTokenError(res, 'Invalid token!', 401);
        }

        if (!verify) {
            return handleRefreshTokenError(res, 'Access denied!', 401);
        }

        const decodedUser = userDecode(req);
        const userId = decodedUser?.user?.user_id;

        if (!userId) {
            return handleRefreshTokenError(res, 'Authentication failed for this user', 400);
        }

        let user;
        try {
            user = await getUserWithStoreAndPackage(userId);
        } catch (err) {
            console.error(err);
            return res.status(401).json({ success: false, message: 'ไม่พบผู้ใช้นี้ค่ะ!' });
        }

        if (!user.store.store_active) {
            return res.status(401).json({
                success: false,
                message: 'ร้านนี้ทำการปิดบัญชีร้านค้าแล้ว \n กรุณาติดต่อ posyayee เพื่อเปิดหากต้องการใช้งาน!',
            });
        }

        const accessToken = generateAccessToken({ user });
        const userDataToken = generateUserDataToken({ user });

        setAccessTokenCookie(res, accessToken);
        
        return res.status(200).send({
            success: true,
            message: 'Refresh token successfully',
            user: user,
            uuid: userDataToken,
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

const handleRefreshTokenError = (res, message, status) => {
    return res.status(status).json({ success: false, message });
};

const getUserWithStoreAndPackage = async (userId) => {
    const user = await User.findOne({
        where: { user_id: userId },
        include: [{ model: Store, include: [Package] }],
    });
    if (!user) throw new Error('User not found');
    return user;
};

const generateAccessToken = ({ user }) => {
    return jwt.sign({ user }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

const generateUserDataToken = ({ user }) => {
    return jwt.sign({ user }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

const setAccessTokenCookie = (res, accessToken) => {
    res.cookie('access_token', accessToken, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        secure: true,
        httpOnly: true,
        sameSite: 'None',
        expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        domain: process.env.MODE === 'production' ? '.posyayee.shop' : '.localhost',
    });
};

module.exports = Refresh;
