const { getUserStoreId } = require("../../../libs/getUserData");
const User = require("../../../models/User");

const GetStoreUser = async (req, res) => {
    try {

        const storeId = await getUserStoreId(req);
        const users = await User.findAll({
            where: { store_id: storeId },
            attributes: [
                'user_id', 'user_fname',
                'user_lname', 'user_image',
                'user_email', 'user_phone',
                'user_role', 'user_active',
                'createdAt', 'updatedAt',
                'user_last_login'
            ],
        });

        return res.status(200).json({
            success: true,
            message: "Get user information successfully!",
            users
        })
    }
    catch (err) {
        console.log("Error while getting users: ", err);
        return res.status(500).json({ success: false, message: 'Error while getting user information' });
    }
}

module.exports = GetStoreUser;