const Order = require("../../models/Order");
const { validateInteger } = require("../../libs/validate");
const { getUserStoreId } = require("../../libs/getUserData");
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

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

        // get old session expires time
        const oldSession = await stripe.checkout.sessions.retrieve(order.order_session_id);
        const expires_at = oldSession.expires_at;
        const expirationTime = new Date(expires_at * 1000);
        const currentTime = new Date();

        // if expires order and create new order using old data
        if (expirationTime < currentTime) {

            console.log('======== expired order ==============');

            // update order 
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card', 'promptpay'],
                line_items: [{
                    price_data: {
                        currency: 'thb',
                        product_data: {
                            name: order.order_title,
                        },
                        unit_amount: `${(order.order_price) * (100)}`,
                    },
                    quantity: 1,
                }],
                mode: 'payment',
                success_url: `${process.env.MODE === "production" ? "https://posyayee.shop" : "http://localhost:5173"}` + `/payment/success?id=${order.order_id_no}`,
            });

            if (!session) {
                throw new Error("เกิดข้อผิดพลาดระหว่างการสร้างรายการออเดอร์");
            }

            const updateOrder = await Order.update(
                { order_session_id: session.id },
                { where: { order_id: order.order_id } }
            );

            console.log('======== update expired order =========');
            console.log(updateOrder);

            return res.status(200).json({
                order: {
                    order_id: order.order_id,
                    order_no: order.order_no,
                    order_title: order.order_title,
                    order_note: order.order_note,
                    order_status: order.order_status,
                    order_price: order.order_price,
                    order_session_id: order.order_session_id,
                    ordder_expires_at: session.expires_at,
                },
                user: {
                    user_id: order.user_id,
                    package_id: order.package_id,
                    store_id: order.store_id,
                }
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
                order_session_id: order.order_session_id,
                ordder_expires_at: expirationTime,
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