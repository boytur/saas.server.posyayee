const connection = require('../connections/connect');
const { DataTypes } = require('sequelize');
const Store = require('./Store');
const User = require('./User');

const UserLog = connection.define('user_logs', {
    user_log_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    user_log_name: {
        type: DataTypes.STRING(225),
        allowNull: false,
    },
    user_log_ip: {
        type: DataTypes.STRING(225),
        allowNull: false,
    }
});

UserLog.belongsTo(User, { foreignKey: 'user_id', allowNull: false, onDelete: "cascade" });
module.exports = UserLog;