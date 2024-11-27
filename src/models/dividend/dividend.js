const { DataTypes, Model } = require('sequelize');
const sequelize = require('../../../infra/database');
const Portfolio = require('../portfolio/portfolio');

class Dividend extends Model {}

Dividend.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: () => require('uuid').v4(),
        primaryKey: true,
    },
    portfolioId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: Portfolio,
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
            min: 0,
        },
    },
    multiplier: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
            min: 0,
        },
    },
    paymentDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
}, {
    sequelize,
    modelName: 'Dividend',
    tableName: 'dividends',
    timestamps: true,
});

Portfolio.hasMany(Dividend, { foreignKey: 'portfolioId', as: 'dividends' });
Dividend.belongsTo(Portfolio, { foreignKey: 'portfolioId', as: 'portfolio' });

module.exports = Dividend;