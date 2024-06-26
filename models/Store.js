const connection = require('../connections/connect');
const { DataTypes } = require("sequelize");
const Package = require('./Package');

const Store = connection.define('stores', {
    store_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    store_image: {
        type: DataTypes.STRING(225),
        allowNull: true,
    },
    store_name: {
        type: DataTypes.STRING(225),
        allowNull: false,
    },
    store_phone: {
        type: DataTypes.STRING(225),
        allowNull: true,
    },
    store_address: {
        type: DataTypes.STRING(225),
        allowNull: true
    },
    store_remaining: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 31
    },
    store_active:{
        type: DataTypes.BOOLEAN,
        allowNull:false,
        defaultValue:true
    },
    store_taxid: {
        type: DataTypes.STRING(45),
        allowNull: true
    },
});
Store.belongsTo(Package, { foreignKey: 'package_id' });

module.exports = Store;