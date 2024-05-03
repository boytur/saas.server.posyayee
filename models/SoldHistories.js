const connection = require('../connections/connect');
const { DataTypes } = require('sequelize');
const User = require('./User');
const Product = require('./Product');
const Store = require('./Store');

const SoldHistories = connection.define('sold_histories', {
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
SoldHistories.belongsTo(Store, { foreignKey: 'store_id', onDelete: "cascade" });
SoldHistories.belongsTo(User, { foreignKey: 'user_id', onDelete: "cascade" });
SoldHistories.belongsTo(Product, { foreignKey: 'prod_id', onDelete: "cascade" });

module.exports = SoldHistories;