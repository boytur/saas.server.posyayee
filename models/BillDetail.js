const connection = require('../connections/connect');
const { DataTypes } = require('sequelize');
const Bill = require('./Bill');
const Product = require('./Product');

const BillDetail = connection.define('bill_details', {
    bill_detail_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    bill_detail_prod_name: {
        type: DataTypes.STRING(225),
        allowNull: false
    },
    bill_detail_cost: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    bill_detail_amount: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    bill_detail_discount: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    bill_detail_quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});

BillDetail.belongsTo(Bill, { foreignKey: 'bill_id', onDelete: "cascade" });
BillDetail.belongsTo(Product, { foreignKey: 'prod_id' });

module.exports = BillDetail;