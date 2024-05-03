const connection = require('../connections/connect');
const { DataTypes } = require('sequelize');
const Store = require('./Store');

const Categories = connection.define('categories', {
    cat_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    cat_name: {
        type: DataTypes.STRING(45),
        allowNull: false
    },
});

Categories.belongsTo(Store, { foreignKey: 'store_id', onDelete: "cascade" });
module.exports = Categories;