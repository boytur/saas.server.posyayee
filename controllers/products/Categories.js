const { getUserStoreId } = require("../../libs/getUserData");
const { validateString } = require("../../libs/validate");
const Categories = require("../../models/Categories");



const AddCategories = async (req, res) => {
    try {
        const { cat_name } = req.body;

        if (!validateString(cat_name) || !cat_name) {
            return res.status(400).json({
                success: false,
                message: 'Invalid categories name'
            })
        }

        const storeId = await getUserStoreId(req);

        const existingCat = await Categories.findAll({
            where: {
                cat_name: cat_name.trim(),
                store_id: storeId
            }
        });

        if (existingCat?.length > 0) {
            return res.status(400).json({
                success: true,
                message: "มีประเภทสินค้านี้ในระบบอยู่แล้วค่ะ"
            })
        }

        const newCat = await Categories.create({
            'cat_name': cat_name,
            'store_id': storeId
        });

        return res.status(201).json({
            success: true,
            message: "สร้างประเภทสินค้าใหม่เรียบร้อยค่ะ",
            categories: newCat,
        });
    }

    catch (e) {
        console.error('Err while adding categories: ', e);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}

const GetCategories = async (req, res) => {
    try {

        const storeId = await getUserStoreId(req);
        const categories = await Categories.findAll({
            where: {
                store_id: storeId
            }
        });

        return res.status(200).json({
            success: true,
            message: 'Get categories successfully',
            categories: categories
        });
    }
    catch (e) {
        console.error('Err while getting categories: ', e);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}


module.exports = { AddCategories, GetCategories }