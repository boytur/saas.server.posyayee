const connection = require('../connections/connect');
const { DataTypes } = require('sequelize');
const Store = require('./Store');

const User = connection.define('tb_users', {
    user_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    user_fname: {
        type: DataTypes.STRING(225),
        allowNull: true
    },
    user_lname: {
        type: DataTypes.STRING(225),
        allowNull: true
    },
    user_email: {
        type: DataTypes.STRING(225),
        allowNull: true,
        unique: true
    },
    user_phone: {
        type: DataTypes.STRING(10),
        allowNull: false,
        unique: true
    },
    user_password: {
        type: DataTypes.STRING(1000),
        allowNull: false
    },
    user_image: {
        type: DataTypes.STRING(225),
        allowNull: true
    },
    user_accepted: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    user_acc_verify: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    user_otp_quota: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 5,
    },
    user_role: {
        type: DataTypes.STRING(45),
        allowNull: false
    },
    user_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    }
});
User.belongsTo(Store, { foreignKey: 'store_id', allowNull: true, onDelete: "cascade" });

module.exports = User;