const connection = require('../connections/connect');
const { DataTypes } = require('sequelize');
const Store = require('./Store');
const UserCredit = require('./UserCredit');
const UserCreditOrder = require('./UserCreditOrder');

const UserCreditDetail = connection.define('tb_credit_details', {
    credit_detail_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    credit_detail_prod_name: {
        type: DataTypes.STRING(225),
        allowNull: false
    },
    credit_detail_amount: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    credit_detail_quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
});

UserCreditDetail.belongsTo(UserCreditOrder, { foreignKey: 'user_credit_order' });

module.exports = UserCreditDetail;