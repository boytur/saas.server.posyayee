const validatePagination = require("../../../libs/validatePagination");
const Store = require("../../../models/Store");
const User = require("../../../models/User");

const getUser = async (req, res) => {
    try {

        const defaultSortBy = 'user_id';
        const allowedSortByAttributes = ['user_id', 'user_fname', 'user_lname', 'user_email', 'user_phone', 'user_role'];
        const { page, perPage, sortBy, sort } = await validatePagination(req.query, allowedSortByAttributes, defaultSortBy);

        const users = await User.findAndCountAll({
            order: [[sortBy, sort.toUpperCase()]],
            limit: perPage,
            offset: (page - 1) * perPage,
            include: [{
                attributes: ['store_id', 'store_name', 'store_address', 'store_remaining', 'store_active', 'store_taxid'],
            }],
            attributes: ['user_id', 'user_email', 'user_phone', 'user_image', 'user_accepted', 'user_acc_verify', 'user_active']
        });

        return res.status(200).json({
            success: true,
            page: page,
            total: users.count,
            per_page: perPage,
            users: users.rows
        });
    } catch (error) {
        console.error("Error while fetching users", error);
        return res.status(error.statusCode || 500).json({ error: error.message || 'Internal Server Error' });
    }
};

module.exports = { getUser };




const getUserDetail = async () => {

}
module.exports = { getUser, getUserDetail };
