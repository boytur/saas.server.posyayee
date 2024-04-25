const connection = require('../connections/connect');
const { DataTypes } = require('sequelize');
const Store = require('./Store');
const User = require('./User');
const Package = require('./Package');

const Order = connection.define('tb_orders', {
    order_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    order_no: {
        type: DataTypes.STRING(45),
        allowNull: false
    },
    order_title: {
        type: DataTypes.STRING(225),
        allowNull: false
    },
    order_note: {
        type: DataTypes.STRING(45),
        allowNull: true
    },
    order_status: {
        type: DataTypes.STRING(45),
        allowNull: false
    },
    order_price: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    order_ref: {
        type: DataTypes.STRING(225),
        allowNull: false
    },
});

Order.belongsTo(User, { foreignKey: 'user_id' });
Order.belongsTo(Package, { foreignKey: 'package_id' });
Order.belongsTo(Store, { foreignKey: 'store_id' });
//Order.sync({ alter: true });

module.exports = Order;