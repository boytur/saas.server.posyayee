const connection = require('../connections/connect');
const { DataTypes } = require('sequelize');
const Store = require('./Store');
const UserCredit = require('./UserCredit');

const UserCreditOrder = connection.define('tb_credit_orders', {
    user_credit_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    user_credit_amount: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
});

UserCreditOrder.belongsTo(UserCredit, { foreignKey: 'user_credit_id', onDelete: "cascade" });

module.exports = UserCreditOrder;