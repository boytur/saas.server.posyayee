const { getUserStoreId } = require('../../libs/getUserData');
const alertStoreRemaining = require('../../middlewares/alertStoreRemaining');
const Categories = require('../../models/Categories');
const Product = require('./../../models/Product');


const GetProduct = async (req, res) => {

    return res.status(200).json({

    });
}

const GetAllProducts = async (req, res) => {
    try {

        const alertResponse = await alertStoreRemaining(req, res);
        if (alertResponse) {
            return;
        }

        const store_id = await getUserStoreId(req) || 0;

        const products = await Product.findAndCountAll({
            where: {
                store_id: store_id,
            }, include: Categories, 
            attributes: ['prod_id', 'prod_barcode', 'prod_name', 'prod_sale', 'prod_image', 'prod_quantity']
        });

        const categories = await Categories.findAll({
            where: {
                store_id: store_id,
            }
            , attributes: ['cat_id', 'cat_name']
        });

        return res.status(200).json({
            success: true,
            message: "get all products successfully",
            total: products.count,
            products: products.rows,
            categories: categories
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Internal server error!"
        })
    }
}
module.exports = { GetProduct, GetAllProducts };