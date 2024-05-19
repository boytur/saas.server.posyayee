const { Op } = require("sequelize");
const { getUserStoreId } = require("../../../libs/getUserData");
const Bill = require("../../../models/Bill");
const alertStoreRemaining = require("../../../middlewares/alertStoreRemaining");
const validatePagination = require("../../../libs/validatePagination");
const User = require("../../../models/User");
const Product = require("../../../models/Product");
const { validateInteger } = require("../../../libs/validate");
const BillDetail = require("../../../models/BillDetail");

const GetBill = async (req, res) => {

    try {

        let { start, end, search } = req.query;

        const alertResponse = await alertStoreRemaining(req, res);
        if (alertResponse) {
            return;
        }

        const defaultSortBy = 'bill_id';
        const allowedSortByAttributes = ['bill_id', 'bill_no', 'bill_all_amount', 'bill_all_discount', 'bill_all_profit', 'bill_payment_method', 'createdAt', 'user_id'];

        let validated = await validatePagination(req.query, allowedSortByAttributes, defaultSortBy);

        if (!validated) {
            return res.status(400).json({
                success: false,
                message: "Invalid page or sort attributes!"
            })
        }

        const storeId = await getUserStoreId(req);

        // Check if start and end are valid dates

        if ((start && isNaN(Date.parse(start))) || (end && isNaN(Date.parse(end)))) {
            return res.status(400).json({
                success: false,
                message: "รูปแบบวันที่ผิดค่ะ!"
            });
        }

        const whereConditions = {
            store_id: storeId
        };

        if (start && end) {
            whereConditions.createdAt = {
                [Op.between]: [start, end]
            };
        }

        if (search) {
            whereConditions.user_id = search
        }

        const bills = await Bill.findAndCountAll({
            order: [[validated.sortBy, validated.sort]],
            limit: validated.perPage,
            offset: (validated.page - 1) * validated.perPage,
            where: whereConditions,
            include: [
                { model: User, attributes: ['user_id', 'user_fname', 'user_lname', 'user_phone'] },
            ],
            attributes: ['bill_id', 'bill_no', 'bill_all_amount', 'bill_all_discount', 'bill_all_profit', 'bill_payment_method', 'createdAt']
        });

        return res.status(200).json({
            success: true,
            message: "Get bills successfully!",
            sort: validated.sort,
            sortBy: validated.sortBy,
            page: validated.page,
            total: bills.count,
            per_page: validated.perPage,
            start: start,
            end: end,
            bills: bills.rows,
        });
    } catch (err) {
        console.log("Error while getting product history: ", err);
        return res.status(500).json({ success: false, message: 'Error while getting product history' });
    }
}

const GetBillInfo = async (req, res) => {
    try {

        const { bill_id } = req.params;

        if (!validateInteger(bill_id)) {
            return res.status(400).json({
                success: false,
                message: "รูปแบบข้อมูลไอดีบิลไม่ถูกต้อง!"
            });
        }

        const storeId = await getUserStoreId(req);

        const bill = await Bill.findOne({
            where: {
                bill_id: bill_id,
                store_id: storeId
            },
            include: [
                { model: User, attributes: ['user_id', 'user_fname', 'user_lname', 'user_phone'] },
            ],
        });

        if (!bill) {
            return res.status(404).json({
                success: false,
                message: "ไม่พบข้อมูลบิลที่ต้องการ!"
            });
        }

        const bill_details = await BillDetail.findAll({
            where: {
                bill_id: bill_id,
            },
            include: [
                {
                    model: Product, attributes: ['prod_id']
                }
            ],
            attributes: [
                'bill_detail_id',
                'bill_detail_prod_name',
                'bill_detail_cost',
                'bill_detail_amount',
                'bill_detail_discount',
                'bill_detail_quantity',
                'bill_detail_profit',
                'bill_id'
            ]
        });

        return res.status(200).json({
            success: true,
            message: "Get bill details successfully!",
            bill: {
                bill: bill,
                bill_details: bill_details
            },
        });
    }
    catch (err) {
        console.log("Error while getting bill details: ", err);
        return res.status(500).json({ success: false, message: 'Error while getting bill details' });
    }
}

module.exports = { GetBill, GetBillInfo }