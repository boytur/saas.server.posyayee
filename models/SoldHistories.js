const connection = require('../connections/connect');
const { DataTypes } = require('sequelize');
const User = require('./User');
const Product = require('./Product');

const SoldHistories = connection.define('tb_sold_histories', {
    sold_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    sold_quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
});

SoldHistories.belongsTo(User, { foreignKey: 'user_id' });
SoldHistories.belongsTo(Product, { foreignKey: 'prod_id' });
// SoldHistories.sync({ alter: true });

module.exports = SoldHistories;