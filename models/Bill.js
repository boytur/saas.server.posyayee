const connection = require('../connections/connect');
const { DataTypes } = require('sequelize');
const Store = require('./Store');
const User = require('./User');

const Bill = connection.define('bills', {
    bill_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    bill_no: {
        type: DataTypes.STRING(225),
        allowNull: false
    }
});

Bill.belongsTo(User, { foreignKey: 'user_id', onDelete: "cascade" });
Bill.belongsTo(Store, { foreignKey: 'store_id', onDelete: "cascade" });
module.exports = Bill;