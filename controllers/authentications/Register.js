const Store = require('../../models/Store');
const User = require('../../models/User');
const { bcryptHash } = require('../../libs/bcrypt');
require('dotenv').config();
const Package = require('../../models/Package');
const jwt = require('jsonwebtoken');
const CreateCheckoutSession = require('../payments/CreateCheckoutSession');
const { validateInteger } = require('../../libs/validate');
const ProductUnit = require('../../models/ProductUnit');
const Categories = require('../../models/Categories');

const Register = async (req, res) => {
    try {
        const {
            store_name,
            package_id,
            user_phone,
            user_password,
            user_accepted,
            pin,
            token
        } = req.body;

        // Validate request data
        const requiredFields = ['store_name', 'package_id', 'user_phone', 'user_password', 'user_accepted'];
        const missingFields = requiredFields.filter(field => !req.body[field]);
        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'กรุณากรอกข้อมูลให้ครบถ้วน!',
                missingFields: missingFields
            });
        }

        // Validate phone number format
        const phoneRegex = /^0[0-9]{9}$/;
        if (!phoneRegex.test(user_phone)) {
            return res.status(400).json({
                success: false,
                message: 'เบอร์โทรศัพท์ไม่ถูกต้อง! กรุณากรอกใหม่ในรูปแบบ 0XXXXXXXXX'
            });
        }

        // Check existing user by phone number
        const existingUsers = await User.findAll({
            where: {
                user_phone: user_phone
            }
        });

        if (existingUsers && existingUsers.user_acc_verify) {
            return res.status(400).json({
                success: false,
                message: 'เบอร์นี้มีคนใช้งานแล้วค่ะ! \n กรุณาลองใหม่อีกครั้ง'
            });
        }

        if (!validateInteger(package_id)) {
            return res.status(400).json({
                success: false,
                message: 'แพ็คเกจไอดีไม่ถูกต้อง!'
            });
        }

        // Find package
        let package = await Package.findByPk(parseInt(package_id), {
            attributes: ['package_id', 'package_name', 'package_price']
        });

        if (package?.length === 0 || !package) {
            return res.status(400).json({
                "success": false,
                "message": "ไม่มีแพ็คเกจไอดีนี้อยู่จริง!"
            });
        };

        // Verify OTP
        const options = {
            method: 'POST',
            headers: { accept: 'application/json', 'content-type': 'application/json' },
            body: JSON.stringify({
                token: token,
                pin: pin,
                accountId: process.env.ACC_ID_SMS,
                secretKey: process.env.SECRET_KEY_SMS
            })
        };

        const response = await fetch('https://smsapi.deecommerce.co.th:4300/service/v1/otp/verify', options);
        const responseOtp = await response.json();

        if (responseOtp.error !== "0") {
            return res.status(400).json({
                success: false,
                message: "OTP ไม่ถูกต้องค่ะ!"
            });
        }

        // Create new store
        let newStore;
        newStore = await Store.create({
            "store_name": store_name,
            "store_remaining": 0,
            "store_active": true,
            "package_id": package.package_id
        });

        // Create new user
        const hashedPassword = await bcryptHash(user_password);
        const newUser = await User.create({
            "user_phone": user_phone,
            "user_password": hashedPassword,
            "user_accepted": user_accepted,
            "user_acc_verify": true,
            "user_active": true,
            "user_role": "owner",
            "store_id": newStore.store_id
        });

        const createNewUnit = await ProductUnit.create({
            'unit_name': 'ชิ้น',
            'store_id': newStore.store_id
        });

        const createNewCategories = await Categories.create({
            'cat_name': 'ทั่วไป',
            'store_id': newStore.store_id
        });
        
        const user = {
            user_acc_verify: newUser.user_acc_verify,
            user_id: newUser.user_id,
            user_fname: newUser.user_fname,
            user_lname: newUser.user_lname,
            user_phone: newUser.user_phone,
            user_role: newUser.user_role,
            user_email: newUser.user_email,
            user_image: newUser.user_image,
            store_id: newUser.store_id,
            store: newStore,
            package: {
                package_id: package.package_id,
                package_name: package.package_name,
            }
        }


        const refreshToken = jwt.sign({ user }, process.env.JWT_REFRESH, { expiresIn: '30d' });
        const accessToken = jwt.sign({ user }, process.env.JWT_SECRET, { expiresIn: '1d' });

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

        CreateCheckoutSession(req, res, package, user, newStore);
    } catch (err) {
        console.error("Error while registering: ", err);
        return res.status(500).json({
            success: false,
            message: `Internal server error! ${err.message}`
        });
    }
}

module.exports = Register;