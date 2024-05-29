const { getUserStoreId } = require("../../../libs/getUserData");
const alertStoreRemaining = require("../../../middlewares/alertStoreRemaining");
const { Op } = require("sequelize");
const Bill = require("../../../models/Bill");
const User = require("../../../models/User");

const GetCashFlow = async (req, res) => {
    try {
        // Destructure query parameters
        const { start, end } = req.query;

        // Check if the store needs to be alerted about remaining stock
        const alertResponse = await alertStoreRemaining(req, res);
        if (alertResponse) {
            return;
        }

        // Get the store ID of the current user
        const storeId = await getUserStoreId(req);

        // Validate date formats
        if ((start && isNaN(Date.parse(start))) || (end && isNaN(Date.parse(end)))) {
            return res.status(400).json({
                success: false,
                message: "รูปแบบวันที่ผิดค่ะ!"
            });
        }

        // Build the where conditions for the database query
        const whereConditions = { store_id: storeId };

        // Add date range condition if both start and end dates are provided
        if (start && end) {
            whereConditions.createdAt = {
                [Op.between]: [new Date(start), new Date(end)],
            };
        }

        // Initialize cash flow totals
        let profit = 0;
        let amount = 0;
        let cash = 0;
        let credit = 0;

        // Retrieve bills based on conditions
        const bills = await Bill.findAndCountAll({
            where: whereConditions,
            attributes: ['bill_id', 'bill_all_amount', 'bill_all_profit','bill_all_discount', 'bill_payment_method', 'createdAt', 'user_id']
        });

        // Retrieve users associated with the store
        const users = await User.findAll({
            where: { store_id: storeId },
            attributes: ['user_id', 'user_fname', 'user_role']
        });

        // Initialize user-specific cash flow totals
        const userCashFlows = users.map(user => ({
            user_id: user.user_id,
            user_fname: user.user_fname,
            user_role: user.user_role,
            cashflow: {
                total_bill: 0,
                profit: 0,
                amount: 0,
                cash: 0,
                credit: 0
            }
        }));

        // Calculate cash flow totals from bills
        bills.rows.forEach(bill => {
            profit += bill.bill_all_profit;
            amount += bill.bill_all_amount;

            if (bill.bill_payment_method === 'cash') {
                cash += bill.bill_all_amount;
            }

            if (bill.bill_payment_method === 'credit') {
                credit += bill.bill_all_amount;
            }

            const billUser = userCashFlows.find(user => user.user_id === bill.user_id);
            if (billUser) {
                billUser.cashflow.total_bill += 1;
                billUser.cashflow.profit += bill.bill_all_profit;
                billUser.cashflow.amount += bill.bill_all_amount;
                if (bill.bill_payment_method === 'cash') {
                    billUser.cashflow.cash += bill.bill_all_amount;
                } else if (bill.bill_payment_method === 'credit') {
                    billUser.cashflow.credit += bill.bill_all_amount;
                }
            }
        });

        // Return the calculated cash flow
        return res.status(200).json({
            success: true,
            message: 'Get cashflow successfully!',
            start,
            end,
            user_cash_flows: userCashFlows,
            all_cash_flows: {
                profit,
                amount,
                cash,
                credit
            },
            total: bills.count,
            bills: bills.rows,
        });
    } catch (err) {
        console.error("Error while getting cash flow: ", err);
        return res.status(500).json({ success: false, message: 'Error while getting cash flow' });
    }
}

module.exports = { GetCashFlow };