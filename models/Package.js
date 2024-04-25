const connection = require('../connections/connect');
const { DataTypes } = require('sequelize');

const Package = connection.define('tb_packages', {
    package_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    package_name: {
        type: DataTypes.STRING(225),
        allowNull: false,
    },
    package_price: {
        type: DataTypes.DOUBLE,
        allowNull: false,
    }
});

// Package.sync({ alter: true });
module.exports = Package;