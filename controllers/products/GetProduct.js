const { getUserStoreId } = require('../../libs/getUserData');
const alertStoreRemaining = require('../../middlewares/alertStoreRemaining');
const Categories = require('../../models/Categories');
const Product = require('./../../models/Product');
const validatePagination = require('../../libs/validatePagination');
const ProductUnit = require('../../models/ProductUnit');
const { Op } = require('sequelize');
const moment = require('moment');

const GetProduct = async (req, res) => {
    try {

        const alertResponse = await alertStoreRemaining(req, res);
        if (alertResponse) {
            return;
        }

        const defaultSortBy = 'prod_id';
        const allowedSortByAttributes = ['prod_id', 'prod_barcode', 'prod_name', 'prod_cost', 'prod_sale', 'prod_quantity'];

        let validated = await validatePagination(req.query, allowedSortByAttributes, defaultSortBy);

        if (!validated) {
            return res.status(400).json({
                success: false,
                message: "Invalid page or sort attributes!"
            })
        }

        const storeId = await getUserStoreId(req);

        const products = await Product.findAndCountAll({
            order: [[validated.sortBy, validated.sort]],
            limit: validated.perPage,
            offset: (validated.page - 1) * validated.perPage,
            where: { store_id: storeId },
            include: [
                { model: Categories, attributes: ['cat_name', 'cat_id'] },
                { model: ProductUnit, attributes: ['unit_id', 'unit_name'] }
            ],
            attributes: ['prod_id', 'prod_image', 'prod_barcode', 'prod_name', 'prod_cost', 'prod_sale', 'prod_quantity', 'prod_status', 'createdAt']
        });

        const categories = await Categories.findAll({
            where: { store_id: storeId },
            attributes: ['cat_id', 'cat_name']
        });

        return res.status(200).json({
            success: true,
            message: "Get product successfully!",
            sort: validated.sort,
            sortBy: validated.sortBy,
            page: validated.page,
            total: products.count,
            per_page: validated.perPage,
            products: products.rows,
            category: categories
        });
    }
    catch (err) {
        console.error("Err while getting products: ", err);
    }
}

const GetOutStockProduct = async (req, res) => {
    try {

        const alertResponse = await alertStoreRemaining(req, res);
        if (alertResponse) {
            return;
        }

        const defaultSortBy = 'prod_id';
        const allowedSortByAttributes = ['prod_id', 'prod_barcode', 'prod_name', 'prod_cost', 'prod_sale', 'prod_quantity'];

        let validated = await validatePagination(req.query, allowedSortByAttributes, defaultSortBy);

        if (!validated) {
            return res.status(400).json({
                success: false,
                message: "Invalid page or sort attributes!"
            })
        }

        const storeId = await getUserStoreId(req);

        const products = await Product.findAndCountAll({
            order: [[validated.sortBy, validated.sort]],
            limit: validated.perPage,
            offset: (validated.page - 1) * validated.perPage,
            where:
            {
                store_id: storeId,
                prod_quantity: { [Op.lt]: 12 },
                prod_status: 'active'
            },
            include: [
                { model: Categories, attributes: ['cat_name', 'cat_id'] },
                { model: ProductUnit, attributes: ['unit_id', 'unit_name'] }
            ],
            attributes: ['prod_id', 'prod_image', 'prod_barcode', 'prod_name', 'prod_cost', 'prod_sale', 'prod_quantity', 'prod_status', 'createdAt']
        });

        const categories = await Categories.findAll({
            where: { store_id: storeId },
            attributes: ['cat_id', 'cat_name']
        });

        return res.status(200).json({
            success: true,
            message: "Get product successfully!",
            sort: validated.sort,
            sortBy: validated.sortBy,
            page: validated.page,
            total: products.count,
            per_page: validated.perPage,
            products: products.rows,
            category: categories
        });
    }
    catch (err) {
        console.error("Err while getting products: ", err);
    }
}

const GetNewProduct = async (req, res) => {
    try {

        const alertResponse = await alertStoreRemaining(req, res);
        if (alertResponse) {
            return;
        }

        const defaultSortBy = 'prod_id';
        const allowedSortByAttributes = ['prod_id', 'prod_barcode', 'prod_name', 'prod_cost', 'prod_sale', 'prod_quantity'];

        let validated = await validatePagination(req.query, allowedSortByAttributes, defaultSortBy);

        if (!validated) {
            return res.status(400).json({
                success: false,
                message: "Invalid page or sort attributes!"
            })
        }

        const storeId = await getUserStoreId(req);

        const products = await Product.findAndCountAll({
            order: [[validated.sortBy, validated.sort]],
            limit: validated.perPage,
            offset: (validated.page - 1) * validated.perPage,
            where:
            {
                store_id: storeId,
                createdAt: {
                    [Op.gt]: moment().subtract(5, 'days').toDate()
                },
            },
            include: [
                { model: Categories, attributes: ['cat_name', 'cat_id'] },
                { model: ProductUnit, attributes: ['unit_id', 'unit_name'] }
            ],
            attributes: ['prod_id', 'prod_image', 'prod_barcode', 'prod_name', 'prod_cost', 'prod_sale', 'prod_quantity', 'prod_status', 'createdAt']
        });

        const categories = await Categories.findAll({
            where: { store_id: storeId },
            attributes: ['cat_id', 'cat_name']
        });

        return res.status(200).json({
            success: true,
            message: "Get product successfully!",
            sort: validated.sort,
            sortBy: validated.sortBy,
            page: validated.page,
            total: products.count,
            per_page: validated.perPage,
            products: products.rows,
            category: categories
        });
    }
    catch (err) {
        console.error("Err while getting products: ", err);
    }
}

const GetInActiveProduct = async (req, res) => {
    try {

        const alertResponse = await alertStoreRemaining(req, res);
        if (alertResponse) {
            return;
        }

        const defaultSortBy = 'prod_id';
        const allowedSortByAttributes = ['prod_id', 'prod_barcode', 'prod_name', 'prod_cost', 'prod_sale', 'prod_quantity'];

        let validated = await validatePagination(req.query, allowedSortByAttributes, defaultSortBy);

        if (!validated) {
            return res.status(400).json({
                success: false,
                message: "Invalid page or sort attributes!"
            })
        }

        const storeId = await getUserStoreId(req);

        const products = await Product.findAndCountAll({
            order: [[validated.sortBy, validated.sort]],
            limit: validated.perPage,
            offset: (validated.page - 1) * validated.perPage,
            where:
            {
                store_id: storeId,
                prod_status: 'inactive'
            },
            include: [
                { model: Categories, attributes: ['cat_name', 'cat_id'] },
                { model: ProductUnit, attributes: ['unit_id', 'unit_name'] }
            ],
            attributes: ['prod_id', 'prod_image', 'prod_barcode', 'prod_name', 'prod_cost', 'prod_sale', 'prod_quantity', 'prod_status', 'createdAt']
        });

        const categories = await Categories.findAll({
            where: { store_id: storeId },
            attributes: ['cat_id', 'cat_name']
        });

        return res.status(200).json({
            success: true,
            message: "Get product successfully!",
            sort: validated.sort,
            sortBy: validated.sortBy,
            page: validated.page,
            total: products.count,
            per_page: validated.perPage,
            products: products.rows,
            category: categories
        });
    }
    catch (err) {
        console.error("Err while getting products: ", err);
    }
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
                prod_status:'active'
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

module.exports = { GetProduct, GetAllProducts, validatePagination, GetOutStockProduct, GetInActiveProduct, GetNewProduct };