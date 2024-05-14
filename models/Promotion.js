const Store = require("./Store");
const connection = require("../connections/connect");
const { DataTypes } = require('sequelize');

const Promotion = connection.define('promotions', {
    promo_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    promo_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    promo_prod_amount:{
        type: DataTypes.INTEGER,
        allowNull:false,
    },
    promo_prod_price:{
        type: DataTypes.DOUBLE,
        allowNull:false,
    },
    start_date: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    end_date: {
        type: DataTypes.DATE,
        allowNull: true,
    },
});

Promotion.belongsTo(Store, { foreignKey: 'store_id', onDelete: "cascade" });
module.exports = Promotion;