const connection = require('../connections/connect');
const { DataTypes } = require('sequelize');

const Package = connection.define('packages', {
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
    package_des: {
        type: DataTypes.STRING(1000),
        allowNull: false,
    },
    package_price: {
        type: DataTypes.DOUBLE,
        allowNull: false,
    },
    package_user_limit: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    package_prod_limit: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
});

module.exports = Package;