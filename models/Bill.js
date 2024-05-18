const connection = require('../connections/connect');
const { DataTypes } = require('sequelize');
const Store = require('./Store');
const User = require('./User');
const UserCredit = require('./UserCredit');

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
    },
    bill_all_amount: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    bill_receive: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    bill_change: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    bill_all_discount: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    bill_all_profit: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    bill_payment_method: {
        type: DataTypes.STRING(45),
        allowNull: false
    }
});

Bill.belongsTo(User, { foreignKey: 'user_id' });
Bill.belongsTo(Store, { foreignKey: 'store_id', onDelete: "cascade" });
Bill.belongsTo(UserCredit, { foreignKey: 'user_credit_id', allowNull: true });
module.exports = Bill;