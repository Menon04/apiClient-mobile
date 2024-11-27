const { DataTypes, Model } = require('sequelize');
const sequelize = require('../../../infra/database');
const User = require('../user/user');
const Ticker = require('../ticker/ticker');

class Portfolio extends Model {}

Portfolio.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: () => require('uuid').v4(),
        primaryKey: true,
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: User,
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    tickerId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: Ticker,
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
        },
    },
    averagePrice: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
            min: 0,
        },
    },
}, {
    sequelize,
    modelName: 'Portfolio',
    tableName: 'portfolios',
    timestamps: true,
});

User.hasMany(Portfolio, { foreignKey: 'userId', as: 'portfolios' });
Portfolio.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Ticker.hasMany(Portfolio, { foreignKey: 'tickerId', as: 'portfolios' });
Portfolio.belongsTo(Ticker, { foreignKey: 'tickerId', as: 'ticker' });

module.exports = Portfolio;
