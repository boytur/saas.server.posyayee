const connection = require('../connections/connect');
const { DataTypes } = require('sequelize');
const Store = require('./Store');
const Categories = require('./Categories');

const Product = connection.define('products', {
    prod_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    prod_barcode: {
        type: DataTypes.STRING(20),
        allowNull: true,
        unique: true,
    },
    prod_name: {
        type: DataTypes.STRING(225),
        allowNull: false,
    },
    prod_description: {
        type: DataTypes.STRING(225),
        allowNull: true,
    },
    prod_cost: {
        type: DataTypes.DOUBLE,
        allowNull: false,
    },
    prod_sale:{
        type: DataTypes.DOUBLE,
        allowNull:false
    },
    prod_quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    prod_image: {
        type: DataTypes.STRING(225),
        allowNull: true,
    },
});

Product.belongsTo(Store, { foreignKey: 'store_id', onDelete: "cascade" });
Product.belongsTo(Categories, { foreignKey: 'cat_id', allowNull: true, onDelete: "cascade" });

module.exports = Product;