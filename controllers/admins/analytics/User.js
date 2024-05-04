const validatePagination = require("../../../libs/validatePagination");
const Store = require("../../../models/Store");
const User = require("../../../models/User");

const getUser = async (req, res) => {

    try {
        const defaultSortBy = 'user_id';
        const allowedSortByAttributes = ['user_id', 'user_fname', 'user_lname', 'user_email', 'user_phone', 'user_role'];
        let validated = await validatePagination(req.query, allowedSortByAttributes, defaultSortBy);

        if (!validated) {
            return res.status(400).json({
                success: false,
                message: "Invalid page or sort attributes!"
            })
        }

        const users = await User.findAndCountAll({
            limit: validated.perPage,
            order: [[validated.sortBy, validated.sort]],
            offset: (validated.page - 1) * validated.perPage,
            include: [{
                model: Store,
                attributes: ['store_id', 'store_name', 'store_address', 'store_remaining', 'store_active', 'store_taxid'],
            }],
            attributes: ['user_id', 'user_email', 'user_phone', 'user_image', 'user_accepted', 'user_acc_verify', 'user_active']
        });

        return res.status(200).json({
            success: true,
            message: "Get users successfully!",
            sort: validated.sort,
            sortBy: validated.sortBy,
            page: validated.page,
            perPage: validated.perPage,
            total: users.count,
            users: users.rows
        });

    } catch (error) {
        console.error("Error while fetching users", error);
        return res.status(error.statusCode || 500).json(
            {
                success: false,
                message: error.message || 'Internal Server Error'
            });
    }
};

module.exports = { getUser };




const getUserDetail = async () => {

}
module.exports = { getUser, getUserDetail };
