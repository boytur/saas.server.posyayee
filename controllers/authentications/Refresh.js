const jwt = require('jsonwebtoken');
const userDecode = require('../../libs/userDecode');
const User = require('../../models/User');
const Store = require('../../models/Store');
const Package = require('../../models/Package');
const Setting = require('../../models/Setting');

const Refresh = async (req, res) => {
    try {
        const refreshToken = req.cookies.refresh_token;

        if (!refreshToken) {
            return res.status(403).json({
                success: false,
                message: 'Refresh token not available for this application.'
            });
        }

        try {
            const secret = process.env.JWT_REFRESH;
            const verify = jwt.verify(refreshToken, secret);

            if (verify !== null) {
                const decodeUser = userDecode(req);
                const userId = decodeUser?.user?.user_id;

                if (!userId) {
                    return res.status(400).json({ success: false, message: "Authentication failed for this user" })
                }

                let user = await User.findOne({
                    where: { user_id: userId },
                    include: [
                        { model: Store, include: [Package] }
                    ]
                });

                if (!user) {
                    return res.status(401).json({ success: false, message: "ไม่พบผู้ใช้นี้ค่ะ!" });
                }

                if (!user.store.store_active) {
                    res.status(401).json({
                        sucess: false,
                        message: 'ร้านนี้ทำการปิดบัญชีร้านค้าแล้ว \n กรุณาติดต่อ posyayee เพื่อเปิดหากต้องการใช้งาน!',
                    });
                }

                const setting = await Setting.findOne({
                    where: { store_id: user.store_id }
                });

                user = {
                    user_id: user.user_id,
                    user_acc_verify: user.user_acc_verify,
                    user_fname: user.user_fname,
                    user_lname: user.user_lname,
                    user_phone: user.user_phone,
                    user_role: user.user_role,
                    user_email: user.user_email,
                    user_image: user.user_image,
                    user_last_login: user.user_last_login,
                    store_id: user.store_id,
                    store: {
                        store_id: user.store.store_id,
                        store_name: user.store.store_name,
                        store_remaining: user.store.store_remaining,
                        store_active: user.store.store_active,
                        store_address: user.store.store_address,
                        store_phone: user.store.store_phone,
                        store_taxid: user.store.store_taxid,
                        store_image: user.store.store_image,
                        package_id: user.store.package_id,
                    },
                    setting,
                    package: {
                        package_id: user.store.package.package_id,
                        package_name: user.store.package.package_name,
                    }
                }

                const accessToken = jwt.sign({ user }, process.env.JWT_SECRET, { expiresIn: '1d' });
                const userDataToken = jwt.sign({ user }, process.env.JWT_SECRET, { expiresIn: '1d' });

                res.cookie('access_token', accessToken, {
                    maxAge: 1 * 24 * 60 * 60 * 1000,
                    secure: true,
                    httpOnly: true,
                    sameSite: 'None',
                    expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
                    domain: process.env.MODE === 'production' ? '.posyayee.shop' : '.localhost',
                });

                res.status(200).send({
                    success: true,
                    message: "Refresh token successfully",
                    user: user,
                    uuid: userDataToken
                });
            } else {
                res.status(401).send({
                    success: false,
                    message: "Access denied!"
                });
            }
        } catch (err) {
            console.error(err);
            res.status(401).send({
                success: false,
                message: "Invalid token!"
            });
        }
    } catch (err) {
        console.log(err);
    }
};

module.exports = Refresh;