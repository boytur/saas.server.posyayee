const { where } = require("sequelize");
const Order = require("../../models/Order");

const GetOrderSessionId = async (req, res) => {
    try {

        const { order_id } = req.params;

        if (!order_id) {
            return res.status(400).json({
                sucess: false,
                messgae: "Invalid Order Id!",
            });
        }

        const order = await Order.findByPk(order_id);

        if (!order) {
            return res.status(404).json({
                sucess: false,
                messgae: "ไม่พบออเดอร์ไอดีนี้!",
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
    }
    catch (err) {
        console.log("Err while get order session id: ", err);
    }
}
module.exports = GetOrderSessionId;