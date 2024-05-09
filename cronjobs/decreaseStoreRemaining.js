const Store = require('../models/Store');
const { Op } = require('sequelize');
const User = require('../models/User');
const Package = require('../models/Package');
const Order = require('../models/Order');
const { getNextOrderNumber } = require('../libs/getNextOrderNumber');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const decreaseStoreRemaining = async () => {
    try {

        const stores = await Store.findAll({
            where: {
                store_remaining: {
                    [Op.gt]: 0
                }
            }
        });

        console.log('==================================');
        console.log('==== DECREASE STORE REMAINING ====');
        console.log('==================================');

        for (const store of stores) {

            await store.update({ store_remaining: store.store_remaining - 1 });

            // Create a new order for next mount
            if (store.store_remaining === 5 && store.package_id !== 1) {

                const ownerStore = await User.findOne({
                    where: {
                        store_id: store.store_id,
                        user_role: "owner"
                    }
                });

                const package = await Package.findOne({
                    where: {
                        package_id: store.package_id,
                    }
                });

                // Create new order
                const newOrderNo = await getNextOrderNumber();

                // create new order with stripe
                const orderSessionsNo = uuidv4();
                const orderSessionsNoSecondary = uuidv4();

                const session = await stripe.checkout.sessions.create({
                    payment_method_types: ['card', 'promptpay'],
                    line_items: [{
                        price_data: {
                            currency: 'thb',
                            product_data: {
                                name: `ค่าบริการแพ็คเกจรายเดือนแพ็คเกจ${package.package_name}`,
                            },
                            unit_amount: `${(package.package_price) * (100)}`,
                        },
                        quantity: 1,
                    }],
                    mode: 'payment',
                    success_url: `${process.env.MODE === "production" ? "https://posyayee.shop" : "http://localhost:5173"}` + `/payment/success?id=${orderSessionsNo}-${orderSessionsNoSecondary}`,
                    cancel_url: `${process.env.MODE === "production" ? "https://posyayee.shop" : "http://localhost:5173"}` + `/payment/cancel?id=${orderSessionsNo}-${orderSessionsNoSecondary}`,
                });

                const orderIdNo = `${orderSessionsNo}-${orderSessionsNoSecondary}`;

                if (!session || !orderIdNo) {
                    throw new Error("เกิดข้อผิดพลาดระหว่างการสร้างรายการออเดอร์");
                }

                const newOrder = await Order.create({
                    "order_title": `ค่าบริการแพ็คเกจรายเดือน ${package.package_name}`,
                    "order_no": newOrderNo,
                    "order_note": "#สร้างรายการอัตโนมัติ",
                    "order_status": "initialize",
                    "order_price": package.package_price,
                    "order_id_no": orderIdNo,
                    "order_session_id": session.id,
                    "order_status": session.status,
                    "package_id": package.package_id,
                    "user_id": ownerStore.user_id,
                    "store_id": store.store_id
                });
                
                console.log('==================================');
                console.log('======= AUTO CREATED ORDER =======');
                console.log('==================================');
            }
        }

    } catch (err) {
        console.error('Error while decreasing Store Remaining: ', err);
    }
}

module.exports = decreaseStoreRemaining;
