const connection = require('../connections/connect');
const { DataTypes } = require('sequelize');
const Store = require('./Store');
const User = require('./User');

const Otp = connection.define('tb_otp', {
    otp_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    otp_refno: {
        type: DataTypes.STRING(225),
        allowNull: false
    },
    otp_token: {
        type: DataTypes.STRING(225),
        allowNull: false
    }
});

Otp.belongsTo(User, { foreignKey: 'user_id', onDelete: "cascade" });
Otp.belongsTo(Store, { foreignKey: 'store_id', onDelete: "cascade" });

module.exports = Otp;