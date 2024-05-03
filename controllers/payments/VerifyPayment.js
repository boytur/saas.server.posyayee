const { where } = require('sequelize');
const Order = require('../../models/Order');
const Store = require('../../models/Store');
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_ENPONT_SECRET_KEY;

const VerifyPayment = async (req, res) => {
    try {

        // Stripe Webhook endpoint for raw payloads
        const sig = req.headers['stripe-signature'];
        let event;

        try {
            event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
        } catch (err) {
            console.log("============ ALERT ===============")
            console.error(err.message);
            console.log("From-IP: ", req.ip)
            console.log("============ ALERT ===============")
            return;
        }

        // Handle the event
        switch (event?.type) {
            case 'checkout.session.completed':
                const paymentData = event.data.object;
                const orderSessionId = paymentData.id;
                const status = paymentData.status;

                const order = await Order.findOne({
                    where: { order_session_id: orderSessionId },
                    include: [
                        { model: Store }
                    ]
                });

                if (!order?.store || order?.store?.store_id === null) {
                    return res.status(400).json({
                        sucess: false,
                        message: "ไม่พบร้านค้าไอดีนี้"
                    });
                }

                const updatedStoreRemaining = await Store.update(
                    { store_remaining: order.store.store_remaining + 31 },
                    { where: { store_id: order.store.store_id } }
                );

                console.log("Updated updatedStoreRemaining: ", updatedStoreRemaining);

                const updatedStoreActive = await Store.update(
                    { store_active: true },
                    { where: { store_id: order.store.store_id } }
                );

                console.log("Updated updatedStoreActive: ", updatedStoreActive);

                try {
                    const updatedRows = await Order.update(
                        { order_status: status },
                        { where: { order_session_id: orderSessionId } }
                    );

                    console.log("Updated payment success fully!: ", updatedRows);

                } catch (error) {
                    console.error("Error updating payment: ", error.message);
                }
                break;
            default:
                console.log(`Unhandled event type ${event?.type}`);
        }

        // Return a res to acknowledge receipt of the event
        return res.json({ received: true });
    }
    catch (err) {
        console.error(err);
        return;
    }
}

module.exports = VerifyPayment;