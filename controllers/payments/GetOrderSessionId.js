const { where } = require("sequelize");
const Order = require("../../models/Order");
const { validateInteger } = require("../../libs/validate");
const { getUserStoreId } = require("../../libs/getUserData");

const GetOrderSessionId = async (req, res) => {
    try {
        const { order_id } = req.params;

        if (!order_id || !validateInteger(order_id)) {
            return res.status(400).json({
                success: false,
                message: "ออเดอร์ไอดีไม่ถูกต้อง!",
            });
        }

        const storeId = await getUserStoreId(req);
        const order = await Order.findByPk(parseInt(order_id));

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "ไม่พบออเดอร์ไอดีนี้ค่ะ!",
            });
        }

        if (order.store_id !== storeId) {
            return res.status(404).json({
                success: false,
                message: "ไม่พบออเดอร์ไอดีนี้ค่ะ!",
            });
        }

        return res.status(200).json({
            order: {
                order_id: order.order_id,
                order_no: order.order_no,
                order_title: order.order_title,
                order_note: order.order_note,
                order_status: order.order_status,
                order_price: order.order_price,
                order_session_id: order.order_session_id
            },
            user: {
                user_id: order.user_id,
                package_id: order.package_id,
                store_id: order.store_id,
            }
        });
    } catch (err) {
        console.error("Err while get order session id: ", err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            err: err
        });
    }
};

module.exports = GetOrderSessionId;