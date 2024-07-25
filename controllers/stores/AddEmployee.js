const { user } = require("pg/lib/defaults");
const { getUserStoreId } = require("../../libs/getUserData");
const { can_manage_employees } = require("../../middlewares/permission");
const User = require("../../models/User");
const { bcryptHash } = require("../../libs/bcrypt");

/**
 * Add Employee.
 * This function is responsible for adding a new employee to a store.
 * It takes the request object and response object as parameters.
 * It returns the response object.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} The response object.
 * @author {PSBLaLaHey}
 */
const AddEmployee = async (req, res) => {
    try {
        const { user_fname,user_lname, user_phone, user_role } = req.body;
        const storeId = await getUserStoreId(req);

        const user_password = user_phone;
        const hashedPassword = await bcryptHash(user_password);
        
        const phoneRegex = /^0[0-9]{9}$/;
        if (!phoneRegex.test(user_phone)) {
            return res.status(400).json({
                success: false,
                message: 'เบอร์โทรศัพท์ไม่ถูกต้อง! กรุณากรอกใหม่ในรูปแบบ 0XXXXXXXXX'
            });
        }

        const createUser = await User.create({
            user_fname: user_fname,
            user_lname: user_lname,
            user_phone: user_phone,
            user_role: user_role,
            user_password: hashedPassword,
            user_accepted: true,
            store_id: storeId
        });

        return res.status(200).json({
            success: true,
            message: "Add employee successfully",
            storeId: storeId,
            createUser
        });
    } catch (error) {
        console.error("Error adding employee: ", error);
        return res.status(500).json({
            message: "Error adding employee",
        });
        
    }
}
module.exports=AddEmployee;