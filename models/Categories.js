const connection = require('../connections/connect');
const { DataTypes } = require('sequelize');

const Categories = connection.define('tb_categories', {
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

module.exports = Categories;