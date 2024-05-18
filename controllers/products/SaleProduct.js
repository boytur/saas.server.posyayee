const { literal, Sequelize } = require('sequelize');
const getNextBillOrder = require('../../libs/getNextBillOrder');
const { getUserStoreId, getUserId } = require('../../libs/getUserData');
const Bill = require('../../models/Bill');
const UserCredit = require('../../models/UserCredit');
const BillDetail = require('../../models/BillDetail');
const Product = require('../../models/Product');
const { ProductCacheClear } = require('../../cache/Product');

const SaleProduct = async (req, res) => {
    try {

        const { products, discounts, payment_method, user_credit_id, bill_change, bill_receive } = req.body;

        // validate data
        if (!products || products.length === 0 || !bill_receive) {
            return res.status(400).json({
                success: false,
                message: 'Please provide products, bill_change, bill_receive!'
            })
        }

        if (payment_method.trim() !== 'credit' && payment_method.trim() !== 'cash') {
            return res.status(400).json({
                success: false,
                message: 'Invalid payment method'
            })
        }

        if (payment_method === 'credit' && isNaN(user_credit_id)) {
            return res.status(400).json({
                success: false,
                message: "Place provided user_credit_id!"
            })
        }

        const storeId = await getUserStoreId(req);
        const userId = await getUserId(req);
        const billNo = await getNextBillOrder(storeId);

        let billAllAmount = 0;
        let billAllDiscount = 0;
        let billAllProfit = 0;


        if (discounts.length > 0) {
            discounts.forEach(discount => {
                billAllDiscount += parseInt(discount.base_price) - parseInt(discount.promotion.promo_prod_price);
            });
        }

        products.forEach(product => {
            billAllAmount += product.prod_sale * product.quantity;
            billAllProfit += ((product.prod_sale - product.prod_cost) * product.quantity);
        });

        billAllProfit -= billAllDiscount

        // if payment method is CREDIT 
        if (payment_method === "credit" && !isNaN(user_credit_id)) {

            // create new bill with credit for this user
            const newBill = await Bill.create({
                bill_no: billNo,
                bill_all_amount: billAllAmount,
                bill_payment_method: payment_method,
                user_id: userId,
                store_id: storeId,
                bill_change: bill_change,
                bill_receive: bill_receive,
                bill_all_discount: billAllDiscount,
                bill_all_profit: (billAllProfit).toFixed(5),
                user_credit_id: user_credit_id
            });

            // insert data into bill details
            let newBillDetails = [];
            for (const product of products) {

                let allDiscountProd = 0;
                let allProfitProd = 0;

                const productDiscount = discounts?.filter((discount) => discount.prod_id === product.prod_id);

                productDiscount?.forEach(discount => {
                    allDiscountProd += discount.base_price - discount.promotion.promo_prod_price
                });

                allProfitProd += ((product.prod_sale - product.prod_cost) * product.quantity) - allDiscountProd;

                const newBillDetail = await BillDetail.create({
                    bill_detail_prod_name: product.prod_name,
                    bill_detail_amount: product.prod_sale * product.quantity,
                    bill_detail_discount: allDiscountProd,
                    bill_detail_quantity: product.quantity,
                    bill_detail_cost: product.prod_cost * product.quantity,
                    bill_detail_profit: (allProfitProd).toFixed(5),
                    bill_id: newBill.bill_id,
                    prod_id: product.prod_id
                })

                newBillDetails.push(newBillDetail);

                const updateProduct = await Product.update(
                    {
                        prod_quantity: literal(`prod_quantity - ${product.quantity}`)
                    },
                    {
                        where: {
                            prod_id: product.prod_id,
                            store_id: storeId
                        }
                    }
                );
            };

            // update user credit all amount
            const updateUserCredit = await UserCredit.update(
                {
                    user_credit_amount: literal(`user_credit_amount + ${billAllAmount - billAllDiscount}`)
                },
                {
                    where: {
                        user_credit_id: user_credit_id
                    }
                }
            );

            await ProductCacheClear(storeId);

            return res.status(200).json({
                success: true,
                message: "การขายเครดิตเสร็จเรียบร้อยค่ะ!"
            })
        }

        if (payment_method === "cash") {
            // create new bill with credit for this user
            const newBill = await Bill.create({
                bill_no: billNo,
                bill_all_amount: billAllAmount,
                bill_change: bill_change,
                bill_receive: bill_receive,
                bill_payment_method: payment_method,
                bill_all_discount: billAllDiscount,
                bill_all_profit: (billAllProfit).toFixed(5),
                user_id: userId,
                store_id: storeId,
            });

            // insert data into bill details and update product quantity
            let newBillDetails = [];
            for (const product of products) {

                let allDiscountProd = 0;
                let allProfitProd = 0;

                const productDiscount = discounts?.filter((discount) => discount.prod_id === product.prod_id);

                productDiscount?.forEach(discount => {
                    allDiscountProd += discount.base_price - discount.promotion.promo_prod_price;
                });

                allProfitProd += ((product.prod_sale - product.prod_cost) * product.quantity) - allDiscountProd;

                // create new bill detail
                const newBillDetail = await BillDetail.create({
                    bill_detail_prod_name: product.prod_name,
                    bill_detail_amount: product.prod_sale * product.quantity,
                    bill_detail_cost: product.prod_cost * product.quantity,
                    bill_detail_discount: allDiscountProd,
                    bill_detail_quantity: product.quantity,
                    bill_detail_profit: (allProfitProd).toFixed(5),
                    bill_id: newBill.bill_id,
                    prod_id: product.prod_id
                })

                newBillDetails.push(newBillDetail);
                const updateProduct = await Product.update(
                    {
                        prod_quantity: literal(`prod_quantity - ${product.quantity}`)
                    },
                    {
                        where: {
                            prod_id: product.prod_id,
                            store_id: storeId
                        }
                    }
                );
            };

            await ProductCacheClear(storeId);

            return res.status(200).json({
                success: true,
                message: "การขายเงินสดเสร็จเรียบร้อยค่ะ!"
            })
        }
    }
    catch (err) {
        console.log("Err while saling product: ", err);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}
module.exports = SaleProduct