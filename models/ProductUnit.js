const connection = require('../connections/connect');
const { DataTypes } = require('sequelize');
const Store = require('./Store');

const ProductUnit = connection.define('product_unit', {
    unit_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    unit_name: {
        type: DataTypes.STRING(45),
        allowNull: false
    },
});

ProductUnit.belongsTo(Store, { foreignKey: 'store_id', onDelete: "cascade" });
module.exports = ProductUnit;