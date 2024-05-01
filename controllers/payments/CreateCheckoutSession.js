const Order = require('../../models/Order');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const getNextOrderNumber = async () => {
    const lastOrder = await Order.findAll({
        order: [['createdAt', 'DESC']],
        limit: 1
    });
    let lastOrderNo = 0;
    if (lastOrder.length > 0 && lastOrder[0].order_no) {
        lastOrderNo = parseInt(lastOrder[0].order_no);
    }
    return lastOrderNo + 1;
}

const CreateCheckoutSession = async (req, res, package, user, newStore) => {
    try {
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
            "order_note": "#",
            "order_status": "initialize",
            "order_price": package.package_price,
            "order_id_no": orderIdNo,
            "order_session_id": session.id,
            "order_status": session.status,
            "package_id": package.package_id,
            "user_id": user.user_id,
            "store_id": newStore.store_id
        });

        return res.status(201).json({
            "success": true,
            "message": "สร้างร้านค้าและผู้ใช้งานเรียบร้อยแล้ว!",
            "user": user,
            "order": newOrder
        });
    }
    catch (err) {
        console.error(err.message);
        return res.status(500).json({ success: false, message: err.message });
    }
}

module.exports = CreateCheckoutSession;