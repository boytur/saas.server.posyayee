const { getUserStoreId, getUserId } = require("../../libs/getUserData");
const Order = require("../../models/Order");
const { validatePagination } = require("../products/GetProduct");

const GetOpenOrder = async (req, res) => {
    try {

        const storeId = await getUserStoreId(req);
        const userId = await getUserId(req);

        if (!storeId || !userId) {
            return res.status(400).json({
                message: "ร้านค้าหรือผู้ใช้งานไม่ถูกต้อง"
            });
        }

        const order = await Order.findOne({
            where: {
                store_id: storeId,
                user_id: userId,
                order_status: 'open'
            },
            attributes: ['order_id', 'order_no', 'order_title', 'order_status', 'createdAt']
        });

        return res.status(200).json({
            success: true,
            message: "Get open order successfully",
            order: order
        });
    }
    catch (e) {
        console.error("Error getting order: ", e);
    }
}


const GetOrder = async (req, res) => {
    try {

        const storeId = await getUserStoreId(req);
        const userId = await getUserId(req);

        const defaultSortBy = 'order_id';
        const allowedSortByAttributes = ['order_id', 'order_no', 'order_title', 'order_price', 'order_status', 'createdAt'];

        let validated = await validatePagination(req.query, allowedSortByAttributes, defaultSortBy);

        if (!validated) {
            return res.status(400).json({
                success: false,
                message: "Invalid page or sort attributes!"
            })
        }

        if (!storeId || !userId) {
            return res.status(400).json({
                message: "ร้านค้าหรือผู้ใช้งานไม่ถูกต้อง"
            });
        }

        const order = await Order.findAndCountAll({
            order: [[validated.sortBy, validated.sort]],
            limit: validated.perPage,
            offset: (validated.page - 1) * validated.perPage,
            where: {
                store_id: storeId,
                user_id: userId,
            },
            attributes: ['order_id', 'order_no', 'order_title','order_note', 'order_price', 'order_status', 'createdAt']
        });

        return res.status(200).json({
            success: true,
            message: "Get order successfully",
            sort: validated.sort,
            sortBy: validated.sortBy,
            page: validated.page,
            total: order.count,
            per_page: validated.perPage,
            order: order.rows
        });
    }
    catch (e) {
        console.error("Error getting order: ", e);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

const GetOrderDetail = async () => {
    try {

    }
    catch (e) {
        console.error("Error getting order detail: ", e);
    }
}

module.exports = { GetOpenOrder, GetOrderDetail, GetOrder }