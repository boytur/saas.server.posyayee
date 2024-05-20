const connection = require('../connections/connect');
const { DataTypes } = require('sequelize');
const Store = require('./Store');

const Setting = connection.define('settings', {
    stt_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    stt_peep_sound: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: true,
    },
    stt_alway_print: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: true,
    },
    stt_out_stock_value: {
        type: DataTypes.INTEGER,
        defaultValue: 5,
        allowNull: true,
    },
});

Setting.belongsTo(Store, { foreignKey: 'store_id', onDelete: "cascade" });

module.exports = Setting;