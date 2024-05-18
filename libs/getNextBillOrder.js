const Bill = require("../models/Bill");

const getNextBillOrder = async (storeId) => {
    try {
        const lastBill = await Bill.findAll({
            where: {
                store_id: storeId,
            },
            order: [['createdAt', 'DESC']],
            limit: 1
        });
        let lastBillNo = 0;
        if (lastBill.length > 0 && lastBill[0].bill_no) {
            lastBillNo = parseInt(lastBill[0].bill_no);
        }
        else {
            return lastBillNo = '10000001';
        }
        return lastBillNo + 1;
    }
    catch (e) {
        console.log("Err while getting last bill: ", e);
    }
}
module.exports = getNextBillOrder;