const connection = require('../connections/connect');
const { DataTypes } = require('sequelize');
const Store = require('./Store');
const User = require('./User');

const Bill = connection.define('tb_bills', {
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

Bill.belongsTo(User, { foreignKey: 'user_id'});
//Bill.sync({ alter: true });

module.exports = Bill;