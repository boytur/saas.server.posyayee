const express = require('express');
const { GetProduct, GetAllProducts } = require('./GetProduct');
const { can_view_product } = require('../../middlewares/permission');
const products = express.Router();

products.get('/api/product/products', can_view_product, GetProduct);
products.get('/api/product/all-products', can_view_product, GetAllProducts);

module.exports = products;