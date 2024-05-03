const connection = require('../connections/connect');
const { DataTypes } = require('sequelize');
const Store = require('./Store');
const User = require('./User');

const StoreLog = connection.define('store_logs', {
    store_log_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    store_log_name: {
        type: DataTypes.STRING(225),
        allowNull: false,
    },
    store_log_user_ip: {
        type: DataTypes.STRING(225),
        allowNull: false,
    }
});

StoreLog.belongsTo(Store, { foreignKey: 'store_id', allowNull: false, onDelete: "cascade" });
StoreLog.belongsTo(User, { foreignKey: 'user_id', allowNull: false, });

module.exports = StoreLog;