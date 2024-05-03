const connection = require('../connections/connect');
const { DataTypes } = require('sequelize');
const Store = require('./Store');

const UserCredit = connection.define('user_credits', {
    user_credit_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    user_credit_fname: {
        type: DataTypes.STRING(225),
        allowNull: false
    },
    user_credit_lname: {
        type: DataTypes.STRING(225),
        allowNull: false
    },
    user_credit_phone: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    user_credit_address: {
        type: DataTypes.STRING(1000),
        allowNull: true
    }
});

UserCredit.belongsTo(Store, { foreignKey: 'store_id', onDelete: "cascade" });

module.exports = UserCredit;