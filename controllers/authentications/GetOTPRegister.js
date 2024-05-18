const userDecode = require("../../libs/userDecode");
const THAIBULK_SMS_URL = process.env.THAIBULK_SMS_URL;
const OTP_SECRET_KEY = process.env.OTP_SECRET_KEY;
const OTP_APP_KEY = process.env.OTP_APP_KEY;

const fetch = require('node-fetch');
const User = require("../../models/User");
const Refresh = require("./Refresh");
const Package = require("../../models/Package");
const { validateInteger } = require("../../libs/validate");

const GetOTPRegister = async (req, res) => {
    try {

        const {
            store_name,
            package_id,
            user_phone,
            user_password,
            user_accepted } = req.body;

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
        const existingUsers = await User.findOne({
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

        const options = {
            method: 'POST',
            headers: { accept: 'application/json', 'content-type': 'application/json' },
            body: JSON.stringify({
                sender: 'deeSMS.OTP',
                to: `66${user_phone.slice(1)}`,
                lang: 'th',
                isShowRef: '1',
                accountId: process.env.ACC_ID_SMS,
                secretKey: process.env.SECRET_KEY_SMS
            })
        };

        const response = await fetch('https://smsapi.deecommerce.co.th:4300/service/v1/otp/request', options);
        const responseOtp = await response.json();

        if (responseOtp.error !== "0") {
            return res.status(400).json({
                success: false,
                message: "เกิดข้อผิดพลาดที่เซิร์ฟเวอร์ OTP"
            });
        }

        return res.status(200).json({
            success: true,
            user: req.body,
            otp: {
                result: {
                    token: responseOtp.result.token,
                    ref: responseOtp.result.ref,
                }
            }
        });
    }
    catch (err) {
        console.error("Err while getting register OTP", err);
        return res.status(500).json({ success: false, error: "Internal Server Error" });
    }
}

module.exports = GetOTPRegister;
