const { DataTypes, Model } = require('sequelize');
const sequelize = require('../../../infra/database');

class Ticker extends Model {}

Ticker.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: () => require('uuid').v4(),
        primaryKey: true,
    },
    symbol: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    sector: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    type: {
        type: DataTypes.ENUM('stock', 'fund', 'bdr'),
        allowNull: false,
    }
}, {
    sequelize,
    modelName: 'Ticker',
    tableName: 'tickers',
    timestamps: true,
});

module.exports = Ticker;