const Order = require("../models/Order");

const getNextOrderNumber = async () => {
    try {
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
    catch (e) {
        console.log("Err while getting last order", e);
    }
}
module.exports = { getNextOrderNumber }