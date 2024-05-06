const express = require('express');
const { GetProduct, GetAllProducts, GetOutStockProduct, GetInActiveProduct, GetNewProduct } = require('./GetProduct');
const { can_view_product } = require('../../middlewares/permission');
const AddProduct = require('./AddProduct');
const products = express.Router();

const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { fileSize: 3 * 1024 * 1024 },
    fileFilter: (req, file, callback) => {
        try {
            if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
                throw new Error('ไม่อุนุญาติให้อัพโหลดไฟล์ชนิดอื่นนอกจากภาพ!');
            }
            callback(null, true);
        } catch (error) {
            callback(error);
        }
    }
});

products.get('/api/product/products', can_view_product, GetProduct);
products.get('/api/product/outstock-products', can_view_product, GetOutStockProduct);
products.get('/api/product/inactive-products', can_view_product, GetInActiveProduct);
products.get('/api/product/new-products', can_view_product, GetNewProduct);
products.get('/api/product/all-products', can_view_product, GetAllProducts);

products.post('/api/product/add-product', can_view_product, upload.single('prod_image'), (req, res, next) => {
    if (req.fileValidationError) {
        return res.status(400).json({
            success: false,
            message: req.fileValidationError
        });
    }
    AddProduct(req, res, next);
});

module.exports = products;