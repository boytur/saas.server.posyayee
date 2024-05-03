const { bcryptCompare } = require("../../libs/bcrypt");
const Package = require("../../models/Package");
const Store = require("../../models/Store");
const User = require("../../models/User");
const jwt = require('jsonwebtoken');

const Login = async (req, res) => {

    const { user_phone, user_password } = req.body;

    if (!user_phone || !user_password) {
        return res.status(400).json(
            {
                sucess: false,
                message: 'กรุณาป้อนเบอร์โทรศัพท์หรือรหัสผ่าน!',
            });
    }

    let user = await User.findOne({
        where: { user_phone: user_phone },
        include: [
            { model: Store, include: [Package] }
        ]
    });

    if (!user || !user.user_acc_verify) {
        return res.status(404).json({
            sucess: false,
            message: 'ไม่พบผู้ใช้งาน!',
        });
    }

    if (!user.user_active) {
        return res.status(403).json({
            sucess: false,
            message: 'บัญชีนี้ไม่สามารถใช้งานได้ กรุณาติดต่อ posyayee!',
        });
    }

    const comparePassword = await bcryptCompare(user_password, user.user_password);

    if (!comparePassword) {
        return res.status(401).json({
            sucess: false,
            message: 'รหัสผ่านไม่ถูกต้อง!',
        });
    }

    if (!user.store.store_active) {
        return res.status(401).json({
            sucess: false,
            message: "ร้านนี้ทำการปิดบัญชีร้านค้าแล้ว กรุณาติดต่อ Posyayee เพื่อเปิดหากต้องการใช้งาน!",
        });
    }

    user = {
        user_id: user.user_id,
        user_acc_verify: user.user_acc_verify,
        user_fname: user.user_fname,
        user_lname: user.user_lname,
        user_phone: user.user_phone,
        user_role: user.user_role,
        user_email: user.user_email,
        user_image: user.user_image,
        store_id: user.store_id,
        store: {
            store_id: user.store.store_id,
            store_name: user.store.store_name,
            store_remaining: user.store.store_remaining,
            store_active: user.store.store_active,
            package_id: user.store.package_id,
        },
        package: {
            package_id: user.store.package.package_id,
            package_name: user.store.package.package_name,
        }
    }

    const refreshToken = jwt.sign({ user }, process.env.JWT_REFRESH, { expiresIn: '30d' });
    const accessToken = jwt.sign({ user }, process.env.JWT_SECRET, { expiresIn: '1d' });
    const userDataToken = jwt.sign({ user }, process.env.JWT_UUID, { expiresIn: '1d' });

    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 30);

    res.cookie('refresh_token', refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        secure: true,
        httpOnly: true,
        sameSite: 'None',
        expires: expirationDate,
        domain: process.env.MODE === 'production' ? '.posyayee.shop' : '.localhost',
    });

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
        message: "ล็อกอินสำเร็จค่ะ!",
        user: user,
        uuid: userDataToken
    });
}

module.exports = Login;