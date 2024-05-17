const { getUserStoreId } = require("../../libs/getUserData");
const Promotion = require("../../models/Promotion");
const Product = require("../../models/Product");
const Categories = require("../../models/Categories");
const { cache } = require("../../connections/redis");
const { ProductCacheClear } = require("../../cache/Product");

const CreatePromotion = async (req, res) => {
    try {
        const { prod_id, promo_name, promo_prod_amount, promo_prod_price, start_date, end_date } = req.body;

        // Validate required fields
        if (!promo_name || !promo_prod_amount || !promo_prod_price || !prod_id) {
            return res.status(400).json({
                success: false,
                message: "กรุณาระบุข้อมูลให้ครบถ้วนค่ะ!"
            });
        }

        // Validate start_date and end_date
        if (start_date || end_date) {
            if (isNaN(new Date(start_date)) || isNaN(new Date(end_date))) {
                return res.status(400).json({
                    success: false,
                    message: "ฟอร์แมทวันที่ผิดค่ะ!"
                });
            }
        }

        const storeId = await getUserStoreId(req);

        const existingProduct = await Product.findOne({
            where: {
                prod_id: prod_id
            }
        });

        // validate product exists
        if (!existingProduct || !existingProduct?.prod_id) {
            return res.status(400).json({
                success: false,
                message: "ไม่พบสินค้านี้ค่ะ!"
            });
        }

        // create a new promotion
        const newPromotion = await Promotion.create({
            promo_name,
            promo_prod_amount,
            promo_prod_price,
            start_date: start_date || null,
            end_date: end_date || null,
            store_id: storeId
        });

        // assign the promotion to the product
        const updatePromotionProduct = await Product.update(
            { promo_id: newPromotion.promo_id },
            {
                where: {
                    prod_id: prod_id,
                    store_id: storeId,
                }
            });

        await ProductCacheClear(storeId);

        return res.status(200).json({
            success: true,
            message: `เพิ่มโปรโมชั่น ${newPromotion.promo_name} สำเร็จค่ะ!`,
        });
    }
    catch (err) {
        console.log("Err while adding promotion: ", err);
        return res.status(500).json({
            success: false,
            message: "Internal error while adding promotion."
        });
    }
}


const DeletePromotion = async (req, res) => {
    try {
        const { promo_id, } = req.params;

        if (!promo_id) {
            return res.status(404).json({
                success: false,
                message: "ไม่พบข้อมูลโปรโมชั่นค่ะ!"
            })
        }

        const storeId = await getUserStoreId(req);
        const existingPromotion = await Promotion.findOne({
            where: {
                promo_id: promo_id,
                store_id: storeId
            }
        });

        if (!existingPromotion || !existingPromotion?.promo_id) {
            return res.status(404).json({
                success: false,
                message: "ไม่พบข้อมูลโปรโมชั่นค่ะ!"
            })
        }

        const deletePromotion = await Promotion.destroy({
            where: {
                promo_id: promo_id
            }
        });

        await ProductCacheClear(storeId);

        return res.status(200).json({
            success: true,
            message: "ลบโปรโมชันสำเร็จค่ะ",
        });

    }
    catch (err) {
        console.log("Err while deleting promotion: ", err);
        return res.status(500).json({
            success: false,
            message: "Internal error while deleting promotion."
        });
    }
}

module.exports = { CreatePromotion, DeletePromotion }